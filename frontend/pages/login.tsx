import { ViewSafeButton } from '@/lib/components/base/Buttons';
import { PageLayout } from '@/lib/components/page';
import { DEFAULT_NETWORK } from '@/lib/constants/networks';
import { isWeb3Connected, useWeb3 } from '@/lib/state/useWeb3';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Card, CardBody, CardHeader, Fade, Heading, HStack, IconButton, Stack, Text } from '@chakra-ui/react';
import { useSetChain } from '@web3-onboard/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

export default function Login() {
    const router = useRouter();
    const web3 = useWeb3();
    const [, setChain] = useSetChain();
    const [loadingSafe, setLoadSafe] = useState('');

    const [loginState, setLoginState] = useState<'init' | 'safe'>('init');
    const [safes, setSafes] = useState<string[] | { error: string } | 'init'>('init');

    const fetchSafes = useCallback(async () => {
        if (isWeb3Connected(web3)) {
            try {
                const { safes } = await web3.walletConnection.safeServiceClient.getSafesByOwner(web3.walletConnection.address);
                console.log({ safes });
                setSafes(safes);
            } catch (e: any) {
                setSafes({ error: e.message });
            }
        }
    }, [web3]);

    useEffect(() => {
        fetchSafes();
    }, [web3.walletConnection, fetchSafes]);

    useEffect(() => {
        if (isWeb3Connected(web3)) router.push('/app');
    }, []);

    return (
        <PageLayout>
            <Stack flex="1" display="flex" justifyContent={'center'} alignItems="center">
                <Stack w="100%" alignItems={'center'} pos="relative">
                    <Fade in={loginState === 'init'} unmountOnExit style={{ position: 'absolute' }}>
                        <Stack align={'center'}>
                            <Text>Connect to a wallet to get started</Text>
                            <Button w={'360px'} onClick={() => setLoginState('safe')}>
                                Connect as a Safe
                            </Button>
                            <Button
                                w={'360px'}
                                onClick={() => web3.functions.connectEOA().then(success => !!success && router.push('/app'))}
                            >
                                Connect as a Wallet
                            </Button>
                        </Stack>
                    </Fade>

                    <Fade in={loginState === 'safe' && !(safes instanceof Array)} style={{ position: 'absolute' }} unmountOnExit>
                        <Stack align={'center'}>
                            <Text>Connect with your wallet to view your Safes</Text>
                            <HStack>
                                <IconButton icon={<ArrowBackIcon />} aria-label="Back" onClick={() => setLoginState('init')} />
                                <Button
                                    w={'360px'}
                                    onClick={async () => {
                                        if (web3.walletConnection === 'unsupported-network') {
                                            setChain({ chainId: '0x' + DEFAULT_NETWORK.toString(16) });
                                        } else {
                                            web3.functions.connectEOA().then(fetchSafes);
                                        }
                                    }}
                                >
                                    {web3.walletConnection === 'unsupported-network' ? 'Switch Network' : 'Connect'}
                                </Button>
                            </HStack>
                        </Stack>
                    </Fade>
                    <Fade in={safes instanceof Array && loginState !== 'init'} style={{ position: 'absolute' }} unmountOnExit>
                        {safes instanceof Array && isWeb3Connected(web3) && (
                            <Stack align={'center'}>
                                <Text>Choose a Safe to connect as:</Text>
                                <HStack>
                                    <IconButton icon={<ArrowBackIcon />} aria-label="Back" onClick={() => setLoginState('init')} />
                                    <Card>
                                        <CardHeader>
                                            <Heading size="sm">Your Safes</Heading>
                                        </CardHeader>
                                        <CardBody>
                                            {safes.length > 0 ? (
                                                safes.map(safe => (
                                                    <HStack key={safe}>
                                                        <Text>{safe}</Text>
                                                        <ViewSafeButton chainId={web3.walletConnection.chainId} safeAddress={safe} />
                                                        <Button
                                                            size="xs"
                                                            onClick={() => {
                                                                if (web3.walletConnection.walletType === 'EOA') {
                                                                    setLoadSafe(safe);
                                                                    web3.functions
                                                                        .connectSafe(web3.walletConnection, safe)
                                                                        .then(success => !!success && router.push('/app'));
                                                                }
                                                            }}
                                                            isLoading={loadingSafe === safe}
                                                        >
                                                            Connect
                                                        </Button>
                                                    </HStack>
                                                ))
                                            ) : (
                                                <Text>No Safes found, try a different account</Text>
                                            )}
                                        </CardBody>
                                    </Card>
                                </HStack>
                            </Stack>
                        )}
                    </Fade>
                </Stack>

                <Box h="75px" />
                <Box h="10px" />
            </Stack>
        </PageLayout>
    );
}
