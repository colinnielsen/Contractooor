import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

export const truncateString = (string: string, leftAndRightCharCount: number = 4) =>
    `${string.slice(0, leftAndRightCharCount + 1)}...${string.slice(-leftAndRightCharCount)}`;

export const tryParseJson = <T,>(value: string): T | undefined => {
    try {
        return JSON.parse(value);
    } catch (e) {
        return undefined;
    }
};

export function useLocalStorage<T>(key: string, fallbackValue?: T): readonly [T | undefined, React.Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState<T>('init' as T);

    /**
     * @dev should run on init to get the last value and set the fallback value
     */
    useEffect(() => {
        const storedFromPrev = localStorage.getItem(key);
        console.log('storedFromPrev', storedFromPrev);
        const parsedInitial = storedFromPrev && !!tryParseJson(storedFromPrev) ? tryParseJson<T>(storedFromPrev) : fallbackValue;
        console.log('parsedInitial', parsedInitial);

        setValue(parsedInitial as T);
    }, [fallbackValue, key]);

    /**
     * @dev should run on value update to sync local storage
     */
    useEffect(() => {
        if (value === 'init') return;
        if (value === undefined || value === null) {
            localStorage.removeItem(key);
            return;
        }
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value === 'init' ? fallbackValue : value, setValue] as const;
}
