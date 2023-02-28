import { Contract, providers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { CREATE_AGREEMENT_FORM, ALL_FIELD_IDS, NON_FORM_IDS, DOC_DATA, DOC_IDS, AGREEMENT_TEMPLATE } from './constants/agreement';
import { SABLIER_URL } from './constants/networks';

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

export const getTokenInfo = async (provider: providers.Provider, tokenAddress: string) => {
    const ERC20 = new Contract(
        tokenAddress,
        ['function name() view returns (string)', 'function symbol() view returns (string)', 'function decimals() view returns (uint8)'],
        provider,
    );
    const [name, symbol, decimals] = await Promise.all([ERC20.name(), ERC20.symbol(), ERC20.decimals()]);

    return { name, symbol, decimals };
};

export const generateDoc = async (provider: providers.Provider, completedForm: typeof CREATE_AGREEMENT_FORM) => {
    const raw = await fetch('/agreement.html');
    const txt = await raw.text();

    const { name } = await getTokenInfo(provider, completedForm['token-address']);

    const extraData: Record<typeof NON_FORM_IDS[number], string> = {
        'contractooor-url': window.location.origin,
        'sablier-url': SABLIER_URL,
        'token-name': name,
    };
    const someRageTerminateSelected = AGREEMENT_TEMPLATE.steps[4].fields.some(field => completedForm[field.id] === 'x');
    const docData: DOC_DATA = {
        ...completedForm,
        'rage-terminate': someRageTerminateSelected ? 'x' : ' ',
        ...extraData,
    };

    const parser = new DOMParser();
    const doc = parser.parseFromString(txt, 'text/xml');

    DOC_IDS.forEach(id => {
        const elements = doc.querySelectorAll(`[data-insert="${id}"]`);
        if (elements === null) throw new Error(`Element with id ${id} not found`);
        elements.forEach(e => (e.innerHTML = docData[id]));
    });

    return doc.documentElement.outerHTML;
};
