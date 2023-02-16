import { GnosisSafeIcon, WalletIcon } from '@/lib/assets/svgs';
import { truncateString } from '@/lib/helpers';
import { Box, HStack, IconButton, Link, Text } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useSetChain } from '@web3-onboard/react';
import { isConnected, useWeb3 } from '../../state/useWeb3';
import { NETWORKS } from '@/lib/constants/networks';
import { ViewSafeButton } from './Buttons';

export const WalletCard = () => {
    const web3 = useWeb3();

    return (
        <HStack minW="250px" p="4" borderRadius="10px" boxShadow="lg" justifyContent="center" alignItems="center" h="60px">
            {web3.walletConnection === 'unsupported-network' ? (
                <Text color="red.300">Unsupported Network</Text>
            ) : isConnected(web3) ? (
                web3.walletConnection.walletType === 'EOA' ? (
                    <>
                        <WalletIcon />
                        <Text>Connected</Text>
                        <Text fontWeight={700}>{truncateString(web3.walletConnection.address)}</Text>
                    </>
                ) : (
                    <>
                        <GnosisSafeIcon />
                        <Text>Connected</Text>
                        <Text fontWeight={700}>{truncateString(web3.walletConnection.address)}</Text>
                        <ViewSafeButton chainId={web3.walletConnection.chainId} safeAddress={web3.walletConnection.address} />
                    </>
                )
            ) : (
                <Text color="gray.600">Not Connected</Text>
            )}
        </HStack>
    );
};
