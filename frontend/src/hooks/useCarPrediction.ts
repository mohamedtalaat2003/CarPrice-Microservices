import { useState } from 'react';
import { getHandshakeToken, predictPrice, type CarFeatures } from '../api';

export const useCarPrediction = () => {
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const runPrediction = async (features: CarFeatures) => {
        setLoading(true);
        setError(null);
        setPrice(null);
        try {
            const token = await getHandshakeToken();
            const result = await predictPrice(token, features);
            setPrice(result);
            return result;
        } catch (err: any) {
            const msg = err.message || 'System error occurred.';
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { loading, price, error, runPrediction };
};
