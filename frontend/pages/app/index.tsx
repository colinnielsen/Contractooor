import { PageLayout } from '@/lib/components/page';
import { ALL_FIELD_IDS } from '@/lib/constants/agreement';
import { useWeb3 } from '@/lib/state/useWeb3';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Button, Card, CardBody, CardHeader, Heading, HStack, Spacer, Stack, Text } from '@chakra-ui/react';
import DOMPurify from 'dompurify';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
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

export const fetchAndParseAgreement = async (url: string = '/agreement.html') => {
    const raw = await fetch(url);
    const txt = await raw.text();
    const sanitizedHTMLString = DOMPurify(window).sanitize(txt);

    const parser = new DOMParser();
    const doc = parser.parseFromString(txt, 'text/xml');
    ALL_FIELD_IDS.forEach(id => {
        const element = doc.querySelector(`[data-insert="${id}"]`);
        if (element === null) throw new Error(`Element with id ${id} not found`);
        element.innerHTML = 'TESTING 1234';
    });
    console.log(doc.documentElement.innerHTML);

    return sanitizedHTMLString;
};

export default function Dashboard() {
    const web3 = useWeb3();
    const router = useRouter();
    const [doc, setDoc] = useState<string | undefined>();

    // useEffect(() => {
    //     if (!isWeb3Connected(web3)) router.push('/login');
    // }, [web3]);

    return (
        <PageLayout>
            <Box h="20" />
            <Stack>
                <HStack>
                    <Heading>Contract Dashboard</Heading>
                    <Spacer />
                    <Button onClick={() => fetchAndParseAgreement().then(setDoc)}>Test</Button>
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

                {doc && <div dangerouslySetInnerHTML={{ __html: doc }} />}

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
