import { CreateAgreementGrid, ReviewAgreement } from '@/lib/components/agreement-slides';
import { PageLayout } from '@/lib/components/page';
import { CreateAgreementForm, CREATE_AGREEMENT_FORM } from '@/lib/constants/agreement';
import { getFormDataFromContractOnIPFS } from '@/lib/helpers';
import { ErrorState } from '@/lib/hooks/useProposeAgreement';
import { isWeb3Connected, useWeb3 } from '@/lib/state/useWeb3';
import { Box, Center, Spinner } from '@chakra-ui/react';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

type AgreementDataState = CreateAgreementForm | 'init' | 'loading' | ErrorState;
const agreementStateReady = (state: AgreementDataState): state is CreateAgreementForm => typeof state !== 'string' && 'sp-address' in state;

export default function Agreement() {
    const web3 = useWeb3();
    const router = useRouter();
    const agreementHash = router.query['agreement-ipfsHash'] as string;

    const [agreementState, setAgreementState] = useState<AgreementDataState>('init');

    const initialFieldValues = useRef<CreateAgreementForm | undefined>(undefined);

    useEffect(() => {
        if (!agreementHash) router.push('/app');
        setAgreementState('loading');
        getFormDataFromContractOnIPFS(agreementHash)
            .then(formData => {
                if (initialFieldValues.current === undefined) initialFieldValues.current = formData;
                setAgreementState(formData);
            })
            .catch(e => {
                console.error(e);
                setAgreementState({ message: e.message });
            });
    }, [agreementHash]);

    return (
        <PageLayout>
            <Box h="8" />

            <CreateAgreementGrid templateColumns={'1fr 1fr'} p="12">
                {isWeb3Connected(web3) && agreementStateReady(agreementState) ? (
                    <Formik initialValues={agreementState} onSubmit={console.log}>
                        {formik => <ReviewAgreement formik={formik} initialFieldValues={initialFieldValues.current} />}
                    </Formik>
                ) : (
                    <Center h="full">
                        <Spinner />
                    </Center>
                )}
            </CreateAgreementGrid>
        </PageLayout>
    );
}
