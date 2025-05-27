import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import axios from 'axios';
import { ExchangeRate } from '../../entities/exchange-rate.entity';

const CNB_EXCHANGE_URL =
    'https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt?date=';

@Injectable()
export class ExchangeRateService {
    constructor(
        @InjectRepository(ExchangeRate)
        private readonly exchangeRateRepo: Repository<ExchangeRate>
    ) {}

    async getExchangeRates(bypassCache = false): Promise<ExchangeRate[]> {
        if (!bypassCache) {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            const cached = await this.exchangeRateRepo.find({
                where: { createdAtUtc: MoreThan(fiveMinutesAgo) },
            });
            if (cached.length > 0) {
                return cached;
            }
        }

        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const dateStr = `${day}.${month}.${year}`;
        const url = `${CNB_EXCHANGE_URL}${dateStr}`;

        let raw: string;
        try {
            const { data } = await axios.get<string>(url);
            raw = data;
        } catch (err: any) {
            throw new InternalServerErrorException(
                `Failed to fetch exchange rates from CNB: ${err.message}`
            );
        }

        const lines = raw.split('\n').slice(2);
        await this.exchangeRateRepo.clear();

        const rates = lines
            .filter((line) => line.trim())
            .map((line) => {
                const [, currency, amount, code, rate] = line.split('|');
                return this.exchangeRateRepo.create({
                    currency,
                    code,
                    amount: parseInt(amount, 10),
                    rate: parseFloat(rate.replace(',', '.')),
                });
            });

        await this.exchangeRateRepo.save(rates);
        return rates;
    }
}
