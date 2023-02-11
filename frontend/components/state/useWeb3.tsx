import {
  ConnectOptions,
  DisconnectOptions,
  WalletState,
} from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import { init, useConnectWallet, useSetChain } from "@web3-onboard/react";

import { providers, Signer, getDefaultProvider } from "ethers";
import { createContext, useContext, useMemo } from "react";
import { NETWORKS_ARRAY } from "../constants/networks";

export type ConnectionState =
  | "not-connected"
  | "unsupported-network"
  | "connected";

export type Web3State = {
  state: ConnectionState;
  provider: providers.BaseProvider;
  walletType?: "EOA" | "Safe" | "SafeApp";
  eoaAddress?: string;
  chainId?: string;
  signer?: Signer;
  connecting: boolean;
  wallet?: WalletState;
  disconnect: (opt: DisconnectOptions) => Promise<WalletState[]>;
  connect: (opt?: ConnectOptions | undefined) => Promise<WalletState[]>;
};

export type ConnectedWeb3State = Required<Web3State> & {
  state: "connected";
};

export const isConnected = (
  context: Web3State
): context is ConnectedWeb3State => context.state === "connected";

export const isConenctionSucessful = (resolve: WalletState[]) =>
  resolve.length > 0;

const Web3Context = createContext<Web3State | undefined>(undefined);

const injected = injectedModule();

init({
  wallets: [injected],
  chains: NETWORKS_ARRAY,
  appMetadata: {
    name: "Contractooor",
    icon: `/hydra.svg`,
    description: "Create DAO contract agreements with style and ease.",
  },
});

export const Web3Provider = ({
  children: app,
}: {
  children: React.ReactNode;
}) => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [{ connectedChain }] = useSetChain();

  const provider = useMemo(
    () =>
      !!wallet?.provider
        ? new providers.Web3Provider(wallet.provider, "any")
        : getDefaultProvider(),
    [wallet?.provider]
  );

  const signer = useMemo(
    () =>
      !!wallet?.provider
        ? new providers.Web3Provider(wallet.provider, "any").getSigner()
        : undefined,
    [wallet?.provider]
  );

  const web3Context: Web3State = useMemo(
    () => ({
      state: !!wallet ? "connected" : "not-connected",
      provider,
      eoaAddress: wallet?.accounts?.[0]?.address ?? undefined,
      chainId: connectedChain?.id ?? undefined,
      signer,
      connecting,
      wallet: wallet ?? undefined,
      connect,
      disconnect,
    }),
    [provider, signer, wallet, connectedChain, connecting, connect, disconnect]
  );

  return <Web3Context.Provider value={web3Context}>{app}</Web3Context.Provider>;
};

export const useWeb3 = (): Web3State => {
  const context = useContext(Web3Context);
  if (!context) throw new Error("useWeb3 must be used within the Web3Provider");

  return context;
};

export const useConnectedWeb3 = (): ConnectedWeb3State => {
  const context = useContext(Web3Context);
  if (!context || !isConnected(context))
    throw new Error("Connection is not established");

  return context;
};
