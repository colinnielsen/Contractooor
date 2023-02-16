import { PageLayout } from '@/lib/components/page';
import { isWeb3Connected, useWeb3 } from '@/lib/state/useWeb3';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Button, Card, CardBody, CardHeader, Heading, HStack, Spacer, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

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
                    <Heading>Test</Heading>
                    <Spacer />
                </HStack>
                <Box h="12" />

            </Stack>
        </PageLayout>
    );
}
