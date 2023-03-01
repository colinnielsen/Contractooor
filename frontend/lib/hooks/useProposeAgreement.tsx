import { CreateAgreementFormData } from '@/pages/app/create/[create-step]';
import { useState } from 'react';

type ErrorState = { message: string };
type ProposeAgreementState = 'init' | 'loading' | { message: string };

export const propseAgreementFailed = (state: ProposeAgreementState): state is ErrorState => {
    return typeof state === 'object' && 'message' in state;
};

export const useProposeAgreement = (formData: CreateAgreementFormData) => {
    const [state, setState] = useState<'init' | 'loading' | 'success' | { message: string }>('init');

    const propseAgreement = async () => {
        setState('loading');
        try {
            await propseAgreement();
            setState('success');
        } catch (e: any) {
            setState({ message: e.message });
        }
    };

    return {
        state,
        propseAgreement,
    };
};
