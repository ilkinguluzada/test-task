import { gql, useQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';

export interface ExchangeRate {
    id: string;
    currency: string;
    code: string;
    amount: number;
    rate: number;
    createdAtUtc: string;
}

const GET_EXCHANGE_RATES = gql`
    query GetExchangeRates($bypassCache: Boolean!) {
        exchangeRates(bypassCache: $bypassCache) {
            id
            currency
            code
            amount
            rate
            createdAtUtc
        }
    }
`;

export function useExchangeRates() {
    const { data, loading, error, refetch } = useQuery<
        { exchangeRates: ExchangeRate[] },
        { bypassCache: boolean }
    >(GET_EXCHANGE_RATES, {
        variables: { bypassCache: false },
        pollInterval: 30_000,
        fetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: true,
    });

    const [lastFetched, setLastFetched] = useState<Date | null>(null);

    useEffect(() => {
        const ts = data?.exchangeRates?.[0]?.createdAtUtc;
        if (ts) setLastFetched(new Date(ts));
    }, [data]);

    const age = useMemo(() => {
        if (!lastFetched) return '';
        const secs = Math.floor((Date.now() - lastFetched.getTime()) / 1000);
        if (secs < 60) return `${secs} second${secs !== 1 ? 's' : ''} ago`;
        const mins = Math.floor(secs / 60);
        return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
    }, [lastFetched]);

    return {
        exchangeRates: data?.exchangeRates ?? [],
        loading,
        error,
        age,
        refetch,
    };
}
