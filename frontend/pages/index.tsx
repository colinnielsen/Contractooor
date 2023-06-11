import { PageLayout } from '@/lib/components/page';
import { Box, Button, Heading, Stack, Text, useDimensions } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRef } from 'react';

export default function Index() {
    const ref = useRef(null);
    const dimensions = useDimensions(ref);

    return (
        <>
            <Head>
                <title>Contractooor</title>
                <meta name="description" content="Stream tokens based on legal agreements" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageLayout omitWalletInfo>
                <Stack flex="1" display="flex" justifyContent={'center'}>
                    <Box maxW="630px">
                        <Heading fontSize={['36px', '36px', '72px']} lineHeight={['36px', '36px', '72px']}>
                            Streaming equity from Safe to Safe
                        </Heading>
                        <Text fontWeight={500} fontSize="24px">
                            Contractooor enables on-chain agreements between service providers and decentralized autonomous organizations
                        </Text>
                    </Box>
                    <Box h="50px" />

                    <Stack w="100%" alignItems={'center'} pos="relative" height={dimensions?.borderBox.height ?? 'initial'}>
                        <Link href={'/login'}>
                            <Button w={'360px'}>Get Started</Button>
                        </Link>
                    </Stack>

                    <Box h="75px" />
                    <Box h="10px" />
                </Stack>
            </PageLayout>
        </>
    );
}
