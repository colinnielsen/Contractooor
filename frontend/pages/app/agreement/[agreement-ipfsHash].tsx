import { CreateAgreementGrid, ReviewAgreement } from '@/lib/components/agreement-slides';
import { PageLayout } from '@/lib/components/page';
import { CreateAgreementForm } from '@/lib/constants/agreement';
import { NETWORKS } from '@/lib/constants/networks';
import { getFormDataFromContractOnIPFS } from '@/lib/helpers';
import { ErrorState } from '@/lib/hooks/useProposeAgreement';
import { isWeb3Connected, useWeb3 } from '@/lib/state/useWeb3';
import { Box, Center, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { AgreementGraphData, AgreementRequestResponse } from '..';

type AgreementDataState = CreateAgreementForm | 'init' | 'loading' | ErrorState;
const agreementStateReady = (state: AgreementDataState): state is CreateAgreementForm => typeof state !== 'string' && 'sp-address' in state;
export const getAgreementByCID = async (subgraphURL: string, contractURI: string): Promise<AgreementGraphData[]> => {
    const data = {
        query: `query GET_AGREEMENT($contractURI: String!) {
          agreements(where: {contractURI: $contractURI}) {
            id
            status
            agreementHash
            agreementNonce
            provider
            client
            contractURI
            currentProposal {
                id
                proposer
                provider
                client
                contractURI
                targetEndTimestamp
                streamToken
                totalStreamedTokens
                terminationClauses_atWillDays
                terminationClauses_cureTimeDays
                terminationClauses_legalCompulsion
                terminationClauses_moralTurpitude
                terminationClauses_bankruptcyDissolutionInsolvency
                terminationClauses_counterpartyMalfeasance
                terminationClauses_lostControlOfPrivateKeys
            }
            lastProposer
            agreementAddress
            streamId
        }
        }`,
        variables: {
            contractURI,
        },
    };
    const response = await axios.post<AgreementRequestResponse>(subgraphURL, data);
    return response?.data?.data?.agreements ?? [];
};

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
            .then(async formData => {
                const res = await getAgreementByCID(NETWORKS['5'].subgraphURL, agreementHash);
                console.log('res', res)

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
