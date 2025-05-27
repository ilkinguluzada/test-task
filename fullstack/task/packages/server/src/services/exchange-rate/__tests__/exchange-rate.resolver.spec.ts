import { ExchangeRateResolver } from '../exchange-rate.resolver';
import { ExchangeRateService }  from '../exchange-rate.service';
import { ExchangeRate }         from '../../../entities/exchange-rate.entity';

describe('ExchangeRateResolver (unit)', () => {
  let resolver: ExchangeRateResolver;
  let service: jest.Mocked<ExchangeRateService>;

  beforeEach(() => {
    service = {
      getExchangeRates: jest.fn().mockResolvedValue([
        Object.assign(new ExchangeRate(), {
          id: 'abc',
          currency: 'Test',
          code: 'TST',
          amount: 1,
          rate: 1.0,
          createdAtUtc: new Date(),
        }),
      ]),
    } as any;

    resolver = new ExchangeRateResolver(service);
  });

  it('calls getExchangeRates with bypassCache=false by default', async () => {
    const result = await resolver.exchangeRates(false);
    expect(result).toHaveLength(1);
    expect(service.getExchangeRates).toHaveBeenCalledWith(false);
  });

  it('passes the bypassCache argument through', async () => {
    await resolver.exchangeRates(true);
    expect(service.getExchangeRates).toHaveBeenCalledWith(true);
  });
});
