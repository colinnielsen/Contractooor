import { PageLayout } from '@/lib/components/page';
import { isWeb3Connected, useWeb3 } from '@/lib/state/useWeb3';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Button, Card, CardBody, CardHeader, Heading, HStack, Spacer, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CREATE_AGREEMENT_STEPS } from './create/[create-step]';

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
    const [doc, setDoc] = useState<string | undefined>();

    // useEffect(() => {
    //     if (!isWeb3Connected(web3)) router.push('/login');
    // }, [web3]);

    const test = async () => {
        const raw = await fetch('/agreement.html');
        const txt = await raw.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(txt, 'text/html');
        setDoc(txt);
        console.log(doc);
        // React.createElement()
        // set
    };

    return (
        <PageLayout>
            <Box h="20" />
            <Stack>
                <HStack>
                    <Heading>Contract Dashboard</Heading>
                    <Spacer />
                    <Button onClick={test}>Test</Button>
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

                {doc && <iframe  src={'/agreement.html'} />}

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
