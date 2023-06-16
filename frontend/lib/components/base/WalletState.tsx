import { GnosisSafeIcon, WalletIcon } from '@/lib/assets/svgs';
import { truncateString } from '@/lib/helpers';
import { ArrowUpIcon } from '@chakra-ui/icons';
import { Box, Button, Collapse, Flex, HStack, IconButton, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { isWeb3Connected, useWeb3 } from '../../state/useWeb3';
import { ViewSafeButton } from './Buttons';

export const WalletCard = () => {
    const router = useRouter();
    const web3 = useWeb3();
    const { isOpen, onToggle } = useDisclosure();

    return (
        <Box
            minW="250px"
            p="4"
            borderRadius="10px"
            boxShadow="lg"
            display={'flex'}
            justifyContent="center"
            alignItems="center"
            minH="60px"
            right="0"
        >
            {web3.walletConnection === 'unsupported-network' ? (
                <Stack align={'center'}>
                    <Text color="red.300">Unsupported Network</Text>
                    <Button onClick={() => web3.functions.switchNetwork && web3.functions.switchNetwork()}>
                        <Text fontWeight={'bold'}>Switch to Goerli</Text>
                    </Button>
                </Stack>
            ) : isWeb3Connected(web3) ? (
                web3.walletConnection.walletType === 'EOA' ? (
                    <HStack>
                        <WalletIcon />
                        <Text>Connected</Text>
                        <Text fontWeight={700}>{truncateString(web3.walletConnection.address)}</Text>
                        {router.route !== '/login' && (
                            <Button size="xs" colorScheme="red" onClick={() => web3.functions.disconnect('EOA')}>
                                Disconnect
                            </Button>
                        )}
                    </HStack>
                ) : (
                    <Flex align="center" justify={'center'} direction="column">
                        <HStack>
                            <GnosisSafeIcon />
                            <Text>Connected as</Text>
                            <Text fontWeight={700}>{truncateString(web3.walletConnection.address)}</Text>
                            <ViewSafeButton chainId={web3.walletConnection.chainId} safeAddress={web3.walletConnection.address} />
                            <IconButton
                                aria-label="expand-wallet"
                                icon={<ArrowUpIcon />}
                                size="xs"
                                onClick={onToggle}
                                borderRadius="full"
                                transform={`rotate(${!isOpen ? '0deg' : '180deg'})`}
                            />
                        </HStack>
                        <Collapse in={isOpen}>
                            <HStack mt="4">
                                <WalletIcon />
                                <Text>Via</Text>
                                <Text fontWeight={700}>{truncateString(web3.walletConnection.EOAAddress)}</Text>
                                <Button size="xs" colorScheme="red" onClick={() => web3.functions.disconnect('EOA')}>
                                    Disconnect
                                </Button>
                            </HStack>
                        </Collapse>
                    </Flex>
                )
            ) : (
                <Button onClick={() => router.push('/login')}>
                    <Text color="gray.600">Connect</Text>
                </Button>
            )}
        </Box>
    );
};
