import { PageLayout } from '@/lib/components/page';
import { ALL_FIELD_IDS, CreateAgreementForm, CREATE_AGREEMENT_FORM } from '@/lib/constants/agreement';
import { NETWORKS, PINATA_GATEWAY } from '@/lib/constants/networks';
import { docToForm } from '@/lib/helpers';
import { isConnectionActive, useWeb3 } from '@/lib/state/useWeb3';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Button, Card, CardBody, CardHeader, HStack, Heading, Spacer, Stack, Text } from '@chakra-ui/react';
import axios, { AxiosResponse } from 'axios';
import DOMPurify from 'dompurify';
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
    agreementAddress: string;
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
        }
        }`,
        variables: {
            address: address.toLowerCase(),
        },
    };
    const response = await axios<any, AxiosResponse<AgreementRequestResponse>>({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: data,
        url: subgraphURL,
    });
    const agreements = response.data.data.agreements;

    const agreementForms = await Promise.all(
        agreements.map(async agreement => {
            const { data: html } = await axios.get(`${PINATA_GATEWAY}/${agreement.currentProposal.contractURI}`);
            const form = docToForm(html);
            return form;
        }),
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
    const router = useRouter();

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
                                        <Button>View Agreement</Button>
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
                                .map(draft => (
                                    <HStack key={draft.id}>
                                        <Text fontWeight={600}>{draft.name}</Text>
                                        <Spacer />
                                        <Button>View Agreement</Button>
                                    </HStack>
                                ))}
                        </Stack>
                    </CardBody>
                </Card>
            </Stack>
        </PageLayout>
    );
}
