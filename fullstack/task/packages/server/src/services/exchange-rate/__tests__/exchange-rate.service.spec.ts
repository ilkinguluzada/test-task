import axios from 'axios';
import { InternalServerErrorException } from '@nestjs/common';
import { ExchangeRateService } from '../exchange-rate.service';
import { ExchangeRate } from '../../../entities/exchange-rate.entity';
import { MoreThan, FindOperator, Repository } from 'typeorm';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ExchangeRateService (unit)', () => {
  let service: ExchangeRateService;
  let repo: jest.Mocked<Pick<Repository<ExchangeRate>, 'find' | 'clear' | 'save' | 'create'>>;

  beforeEach(() => {
    repo = {
      find: jest.fn(),
      clear: jest.fn(),
      save: jest.fn(),
      create: jest.fn(dto => Object.assign(new ExchangeRate(), dto)),  // <-- now defined
    } as any;

    service = new ExchangeRateService(repo as any);
  });

  it('returns cached rates if they exist and are fresh', async () => {
    const now = new Date();
    const cached = [
      Object.assign(new ExchangeRate(), {
        id: '1',
        currency: 'Foo',
        code: 'FOO',
        amount: 1,
        rate: 1.23,
        createdAtUtc: now,
      }),
    ];
    repo.find.mockResolvedValue(cached);

    const result = await service.getExchangeRates(false);
    expect(result).toBe(cached);
    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(repo.find).toHaveBeenCalledWith({
      where: { createdAtUtc: expect.any(FindOperator) },
    });
  });

  it('fetches, parses, clears, saves and returns new rates when cache is stale', async () => {
    repo.find.mockResolvedValue([]);

    const sampleTxt = [
      'Header line 1',
      'Header line 2',
      'Country|USD|1|USD|23,45',
      'Country|EUR|1|EUR|25,60',
    ].join('\n');
    mockedAxios.get.mockResolvedValue({ data: sampleTxt });

    repo.clear.mockResolvedValue(undefined);
    repo.save.mockResolvedValue([] as any);

    const rates = await service.getExchangeRates(false);

    expect(repo.clear).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
    expect(rates).toHaveLength(2);
    expect(rates[0].code).toBe('USD');
    expect(rates[1].code).toBe('EUR');
  });

  it('throws InternalServerErrorException when the HTTP fetch fails', async () => {
    repo.find.mockResolvedValue([]);
    mockedAxios.get.mockRejectedValue(new Error('network down'));

    await expect(service.getExchangeRates(false)).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });
});
