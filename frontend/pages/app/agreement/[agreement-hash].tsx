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
import { AgreementGraphData, AgreementRequestResponse, ParsedForm, ProposalData } from '..';

type AgreementDataState = ParsedForm | 'init' | 'loading' | ErrorState;
const agreementStateReady = (state: AgreementDataState): state is ParsedForm => typeof state !== 'string' && 'client' in state;
export const getAgreementByAgreementHash = async (subgraphURL: string, agreementHash: string): Promise<AgreementGraphData[]> => {
    const data = {
        query: `query GET_AGREEMENT($agreementHash: String!) {
          agreements(where: {agreementHash: $agreementHash}) {
            id
            status
            agreementHash
            agreementNonce
            provider
            client
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
            agreementHash,
        },
    };
    const response = await axios.post<AgreementRequestResponse>(subgraphURL, data);
    return response?.data?.data?.agreements ?? [];
};

export default function Agreement() {
    const web3 = useWeb3();
    const router = useRouter();
    const agreementHash = router.query['agreement-hash'] as string;

    const [agreementState, setAgreementState] = useState<AgreementDataState>('init');

    const initialFieldValues = useRef<CreateAgreementForm | undefined>(undefined);

    useEffect(() => {
        if (!agreementHash) router.push('/app');
        setAgreementState('loading');
        getAgreementByAgreementHash(NETWORKS['5'].subgraphURL, agreementHash)
            .then(([agreement]) => {
                getFormDataFromContractOnIPFS(agreement.currentProposal.contractURI).then(async formData => {
                    if (initialFieldValues.current === undefined) initialFieldValues.current = formData;
                    setAgreementState({
                        ...agreement,
                        parsedForm: formData,
                    });
                });
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
                    <Formik initialValues={agreementState.parsedForm} onSubmit={console.log}>
                        {formik => (
                            <ReviewAgreement
                                formik={formik}
                                initialFieldValues={initialFieldValues.current}
                                lastProposer={agreementState.lastProposer}
                            />
                        )}
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
