import Safe from '@safe-global/safe-core-sdk';
import EthersAdapter from '@safe-global/safe-ethers-lib';
import SafeServiceClient from '@safe-global/safe-service-client';
import { DisconnectOptions, WalletState } from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import { init, useConnectWallet, useSetChain } from '@web3-onboard/react';
import { ethers, getDefaultProvider, providers, Signer } from 'ethers';
import { useRouter } from 'next/router';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { NETWORKS, NETWORKS_ONBOARD_ARRAY, ChainID } from '../constants/networks';

declare global {
    interface Window {
        provider: any;
        ethereum: any;
    }
}

export type BaseConnection = {
    walletType: 'Safe' | 'EOA';
    address: string;
    chainId: ChainID;
    safeServiceClient: SafeServiceClient;
};

export type ConnectedSafe = BaseConnection & {
    walletType: 'Safe';
    context: 'SafeApp' | 'SDK';
    EOASigner: Signer;
    safeSDK: Safe;
    EOAAddress: string;
};

export type ConnectedEOA = BaseConnection & {
    walletType: 'EOA';
    signer: Signer;
};

type ConnectedWallet = ConnectedSafe | ConnectedEOA;

export type Web3State = {
    connecting: boolean;
    walletConnection: ConnectedWallet | 'disconnected' | 'unsupported-network';
    provider: providers.BaseProvider;
    functions: {
        connectEOA: () => Promise<ConnectedEOA | undefined>;
        connectSafe: (connectedEOA: ConnectedEOA, safeAddress: string) => Promise<ConnectedSafe | undefined>;
        disconnect: (opt: DisconnectOptions) => Promise<WalletState[]>;
    };
};

export type ConnectedWeb3State = Required<Web3State> & {
    walletConnection: ConnectedWallet;
};

export const isConnected = (context: Web3State): context is ConnectedWeb3State =>
    context.walletConnection !== 'disconnected' && context.walletConnection !== 'unsupported-network';

export const isSupportedNetwork = (chainId: number): chainId is ChainID => chainId in NETWORKS;

export const isConenctionSucessful = (resolve: WalletState[]) => resolve.length > 0;

const Web3Context = createContext<Web3State | undefined>(undefined);

const injected = injectedModule();

init({
    wallets: [injected],
    chains: NETWORKS_ONBOARD_ARRAY,
    appMetadata: {
        name: 'Contractooor',
        icon: `/hydra.svg`,
        description: 'Create DAO contract agreements with style and ease.',
    },
    accountCenter: {
        desktop: {
            enabled: false,
        },
        mobile: {
            enabled: false,
        },
    },
});

export const Web3Provider = ({ children: app }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
    const [{ connectedChain }, setChain] = useSetChain();

    const [walletConnection, setWalletConnection] = useState<Web3State['walletConnection']>('disconnected');

    const provider = useMemo(
        () => (!!wallet?.provider ? new providers.Web3Provider(wallet.provider, 'any') : getDefaultProvider()),
        [wallet?.provider],
    );

    const isValidChain = useCallback((chainId: ChainID) => {
        if (isSupportedNetwork(chainId)) return true;

        setWalletConnection('unsupported-network');
        return false;
    }, []);

    const connectEOA = useCallback(async (): Promise<ConnectedEOA | undefined> => {
        const [wallet] = await connect();
        if (wallet === undefined) return;
        const signer = new providers.Web3Provider(wallet.provider, 'any').getSigner();
        const chainId = (await signer.getChainId()) as ChainID;
        if (!isValidChain(chainId)) return;

        const [{ address }] = wallet.accounts;
        const safeServiceClient = new SafeServiceClient({
            txServiceUrl: NETWORKS[chainId].safeServiceURL,
            ethAdapter: new EthersAdapter({
                ethers,
                signerOrProvider: signer,
            }),
        });

        const connectedEOA: ConnectedEOA = {
            walletType: 'EOA',
            address: ethers.utils.getAddress(address),
            signer,
            chainId,
            safeServiceClient,
        };

        setWalletConnection(connectedEOA);
        return connectedEOA;
    }, [connect, isValidChain]);

    const connectSafe = useCallback(
        async (
            { signer, address: EOAAddress, safeServiceClient, chainId }: ConnectedEOA,
            safeAddress: string,
        ): Promise<ConnectedSafe | undefined> => {
            const isIframe = typeof window !== 'undefined' && window.self !== window.top;
            const EOASigner = signer;
            const safeSDK = await Safe.create({
                ethAdapter: new EthersAdapter({
                    ethers,
                    signerOrProvider: EOASigner,
                }),
                safeAddress,
                isL1SafeMasterCopy: chainId === 1,
            });

            const connectedSafe: ConnectedSafe = {
                walletType: 'Safe',
                context: isIframe ? 'SafeApp' : 'SDK',
                EOASigner,
                safeSDK,
                EOAAddress,
                chainId,
                safeServiceClient,
                address: ethers.utils.getAddress(safeAddress),
            };

            setWalletConnection(connectedSafe);
            return connectedSafe;
        },
        [],
    );

    useEffect(() => {
        if (connectedChain) {
            if (!isSupportedNetwork(+connectedChain.id)) {
                setWalletConnection('unsupported-network');
                if (router.route !== '/login') router.push('/login');
            } else {
                connectEOA();
            }
        }
    }, [connectedChain, connectEOA]);

    useEffect(() => {
        const [{ address }] = wallet?.accounts ?? [{ address: undefined }];
        if (
            address &&
            typeof walletConnection !== 'string' &&
            walletConnection.walletType !== 'Safe' &&
            walletConnection.address !== address
        ) {
            setWalletConnection(prev => ({
                ...(prev as ConnectedWallet),
                address: ethers.utils.getAddress(address),
            }));
        }
    }, [wallet?.accounts[0]]);

    const web3Context: Web3State = useMemo(
        () => ({
            connecting,
            walletConnection,
            provider,
            functions: { disconnect, connectSafe, connectEOA },
        }),
        [connecting, walletConnection, provider, disconnect, connectSafe, connectEOA],
    );

    return <Web3Context.Provider value={web3Context}>{app}</Web3Context.Provider>;
};

export const useWeb3 = (): Web3State => {
    const context = useContext(Web3Context);
    if (!context) throw new Error('useWeb3 must be used within the Web3Provider');

    return context;
};

export const useConnectedWeb3 = (): ConnectedWeb3State => {
    const context = useContext(Web3Context);
    if (!context || !isConnected(context)) throw new Error('Connection is not established');

    return context;
};
