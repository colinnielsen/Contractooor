export const NETWORKS = {
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
    rpcUrl: "https://eth-goerli.g.alchemy.com/v2/xzGPKdnYRJOJ8b2rwhhIBt-4zbaFMtVe"
  }
};

export const NETWORKS_ARRAY = Object.values(NETWORKS);