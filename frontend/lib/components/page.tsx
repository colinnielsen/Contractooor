import { Flex, Text, HStack, Spacer, Button } from '@chakra-ui/react';
import Link from 'next/link';
import { WalletCard } from './base/WalletState';

export const PageLayout = ({
    children,
    omitHeader,
    omitWalletInfo,
}: {
    children: React.ReactNode;
    omitHeader?: boolean;
    omitWalletInfo?: boolean;
}) => (
    <Flex w="100%" px="20" py="8" minH="100vh" flexDir={'column'} flexWrap="nowrap">
        <Flex flex="1" flexDir={'column'} flexWrap="nowrap" h="100%">
            {!omitHeader && (
                <HStack align="start" pos="relative" alignItems={'center'} justify="center">
                    <Text fontSize={'2xl'} fontWeight="bold">
                        Contractooor
                    </Text>
                    <Spacer />
                    {omitWalletInfo ? (
                        <Link href="/app">
                            <Button w="fit-content">Dashboard</Button>
                        </Link>
                    ) : (
                        <WalletCard />
                    )}
                </HStack>
            )}
            {children}
        </Flex>
    </Flex>
);
