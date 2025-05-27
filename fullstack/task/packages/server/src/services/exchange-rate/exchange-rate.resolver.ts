import { Args, Query, Resolver } from '@nestjs/graphql';
import { ExchangeRate } from '../../entities/exchange-rate.entity';
import { ExchangeRateService } from './exchange-rate.service';

@Resolver(() => ExchangeRate)
export class ExchangeRateResolver {
    constructor(private readonly exchangeRateService: ExchangeRateService) {}

    @Query(() => [ExchangeRate])
    async exchangeRates(
        @Args('bypassCache', {
            type: () => Boolean,
            nullable: true,
            defaultValue: false,
        })
        bypassCache: boolean
    ): Promise<ExchangeRate[]> {
        return this.exchangeRateService.getExchangeRates(bypassCache);
    }
}
