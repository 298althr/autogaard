import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';

export function useGarage(token: string | null) {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGarage = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await apiFetch('/me/garage', { token });
            setVehicles(res.data);
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchGarage();
    }, [fetchGarage]);

    return { vehicles, loading, error, refetch: fetchGarage };
}

export function useSales(token: string | null) {
    const [sales, setSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSales = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await apiFetch('/me/sales', { token });
            setSales(res.data);
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    return { sales, loading, error, refetch: fetchSales };
}
