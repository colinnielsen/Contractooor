import { PageLayout } from '@/lib/components/page';
import { isWeb3Connected, useWeb3 } from '@/lib/state/useWeb3';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Button, Card, CardBody, CardHeader, Heading, HStack, Spacer, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const draftMock = [
    {
        id: '1',
        name: 'Atlant x Hydra',
        status: 'draft',
        createdAt: '2021-10-10',
        updatedAt: '2021-10-10',
    },
    {
        id: '2',
        name: 'RaidGuild x Hydra',
        status: 'draft',
        createdAt: '2021-10-10',
        updatedAt: '2021-10-10',
    },
];

export default function Dashboard() {
    const web3 = useWeb3();
    const router = useRouter();

    useEffect(() => {
        if (!isWeb3Connected(web3)) router.push('/login');
    }, [web3]);

    return (
        <PageLayout>
            <Box h="20" />
            <Stack>
                <HStack>
                    <Heading>Contract Dashboard</Heading>
                    <Spacer />
                    <Button onClick={() => router.push('/app/create')}>Create Agreement</Button>
                </HStack>
                <Box h="12" />
                <Card>
                    <CardHeader>
                        <Heading size="md">Drafts</Heading>
                    </CardHeader>
                    <CardBody>
                        <Stack>
                            {draftMock.map(draft => (
                                <HStack key={draft.id}>
                                    <Text>{draft.name}</Text>
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
                            {draftMock.map(draft => (
                                <HStack key={draft.id}>
                                    <Text>{draft.name}</Text>
                                    <Spacer />
                                    <Button rightIcon={<ExternalLinkIcon />}>Stream</Button>
                                    <Button rightIcon={<ExternalLinkIcon />}>Agreement</Button>
                                    <Button>Terminate 😈</Button>
                                </HStack>
                            ))}
                        </Stack>
                    </CardBody>
                </Card>
            </Stack>
        </PageLayout>
    );
}
