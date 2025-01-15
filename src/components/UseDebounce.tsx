import { useCallback, useEffect, useState } from 'react';

export const useDebounce = (value: any, delay = 200) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    const debouncedCallback = useCallback(() => {
        const newDebouncedValue = value;
        setDebouncedValue(newDebouncedValue);
    }, [value]);

    useEffect(() => {
        const handler = setTimeout(debouncedCallback, delay);

        return () => clearTimeout(handler);
    }, [debouncedCallback, delay]);

    return debouncedValue;
};
