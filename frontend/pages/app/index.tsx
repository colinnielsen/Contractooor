import { PageLayout } from '@/lib/components/page';
import { CreateAgreementForm } from '@/lib/constants/agreement';
import { NETWORKS } from '@/lib/constants/networks';
import { getFormDataFromContractOnIPFS, getIpfsUrl, getSablierStreamURL } from '@/lib/helpers';
import { isConnectionActive, useWeb3 } from '@/lib/state/useWeb3';
import { Box, Button, Card, CardBody, CardHeader, Heading, HStack, Spacer, Stack, Text } from '@chakra-ui/react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CREATE_AGREEMENT_STEPS } from './create/[create-step]';

type AgreementStatus = 'PROPOSED' | 'ACCEPTED' | 'TERMINATED';

type ProposalGraphData = {
    id: string;
    proposer: string;
    provider: string;
    client: string;
    contractURI: string;
    targetEndTimestamp: string;
    streamToken: string;
    totalStreamedTokens: string;
    terminationClauses_atWillDays: number;
    terminationClauses_cureTimeDays: number;
    terminationClauses_legalCompulsion: boolean;
    terminationClauses_moralTurpitude: boolean;
    terminationClauses_bankruptcyDissolutionInsolvency: boolean;
    terminationClauses_counterpartyMalfeasance: boolean;
    terminationClauses_lostControlOfPrivateKeys: boolean;
};

type AgreementGraphData = {
    id: string;
    status: AgreementStatus;
    agreementGUID: string;
    agreementId: string;
    provider: string;
    client: string;
    currentProposal: ProposalGraphData;
    lastProposer: string;
    agreementAddress: string | null;
    streamId: string | null;
};

type AgreementRequestResponse = {
    data: {
        agreements: AgreementGraphData[];
    };
};

type Agreement = AgreementGraphData & {
    name: string;
    currentProposal: ProposalGraphData & {
        formData: CreateAgreementForm;
    };
};

const getUserAgreements = async (subgraphURL: string, address: string): Promise<Agreement[]> => {
    const data = {
        query: `query GET_AGREEMENTS($address: String!) {
          agreements(provider: $address, or: { client: $address }) {
            id
            status
            agreementGUID
            agreementId
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
            address: address.toLowerCase(),
        },
    };

    const response = await axios.post<AgreementRequestResponse>(subgraphURL, data);
    const agreements = response.data.data.agreements;

    const agreementForms = await Promise.all(
        agreements.map(async agreement => await getFormDataFromContractOnIPFS(agreement.currentProposal.contractURI)),
    );

    return agreements.map((agreement, i) => {
        const formData = agreementForms[i];

        return {
            ...agreement,
            name: `${formData['sp-legal-name']} x ${formData['client-legal-name']}`,
            currentProposal: {
                ...agreement.currentProposal,
                formData: agreementForms[i],
            },
        };
    });
};

export default function App() {
    const web3 = useWeb3();

    const [userAgreements, setUserAgreements] = useState<Agreement[]>([]);

    useEffect(() => {
        if (isConnectionActive(web3.walletConnection)) {
            getUserAgreements(NETWORKS[web3.walletConnection.chainId].subgraphURL, web3.walletConnection.address).then(setUserAgreements);
        }
    }, [isConnectionActive(web3.walletConnection)]);

    console.log(userAgreements.map(a => a.currentProposal.formData));

    return (
        <PageLayout>
            <Box h="20" />
            <Stack>
                <HStack>
                    <Heading>Contract Dashboard</Heading>
                    <Spacer />
                    <Link href={`/app/create/${CREATE_AGREEMENT_STEPS[0]}`}>
                        <Button>Create Agreement</Button>
                    </Link>
                </HStack>
                <Box h="12" />
                <Card>
                    <CardHeader>
                        <Heading size="md">Drafts</Heading>
                    </CardHeader>
                    <CardBody>
                        <Stack>
                            {userAgreements
                                .filter(draft => draft.status === 'PROPOSED')
                                .map(draft => (
                                    <HStack key={draft.id}>
                                        <Text fontWeight={600}>{draft.name}</Text>
                                        <Spacer />
                                        <Link href={`/app/agreement/${draft.currentProposal.contractURI}`}>
                                            <Button>View Agreement</Button>
                                        </Link>
                                    </HStack>
                                ))}
                        </Stack>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <Heading size="md">Signed Agreements</Heading>
                    </CardHeader>
                    <CardBody>
                        <Stack>
                            {userAgreements
                                .filter(draft => draft.status === 'ACCEPTED')
                                .map(agreement => (
                                    <HStack key={agreement.id}>
                                        <Text fontWeight={600}>{agreement.name}</Text>
                                        <Spacer />
                                        <Link href={getIpfsUrl(agreement.currentProposal.contractURI)}>
                                            <Button>View Agreement</Button>
                                        </Link>
                                        {agreement.streamId && (
                                            <Link href={getSablierStreamURL(agreement.streamId)}>
                                                <Button>View Stream</Button>
                                            </Link>
                                        )}
                                    </HStack>
                                ))}
                        </Stack>
                    </CardBody>
                </Card>
            </Stack>
        </PageLayout>
    );
}
