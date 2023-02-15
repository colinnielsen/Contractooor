export const NETWORKS_ONBOARD = {
  1: {
    id: "0x1",
    token: "ETH",
    label: "Ethereum Mainnet",
    rpcUrl:
      "https://eth-mainnet.g.alchemy.com/v2/Q5Y9sPQtW23fQCudAs_Ajjrxri6OHx96",
  },
  5: {
    id: "0x5",
    token: "ETH",
    label: "Ethereum Goerli Testnet",
    rpcUrl:
      "https://eth-goerli.g.alchemy.com/v2/xzGPKdnYRJOJ8b2rwhhIBt-4zbaFMtVe",
  },
};

export const NETWORKS = {
  1: {
    ...NETWORKS_ONBOARD[1],
    safeServiceURL: "https://safe-transaction-mainnet.safe.global/",
  },
  5: {
    ...NETWORKS_ONBOARD[5],
    safeServiceURL: "https://safe-transaction-goerli.safe.global/",
  },
};

export const ChainIDs = {
  MAINNET: 1,
  GOERLI: 5,
} as const;

export const DEFAULT_NETWORK = ChainIDs.GOERLI;

export type ChainID = keyof typeof NETWORKS;

export const NETWORKS_ONBOARD_ARRAY = Object.values(NETWORKS_ONBOARD);
