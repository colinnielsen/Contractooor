export const SABLIER_URL = 'https://sablier.finance/';

export const NETWORKS_ONBOARD = {
    1: {
        id: '0x1',
        token: 'ETH',
        label: 'Ethereum Mainnet',
        rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/Q5Y9sPQtW23fQCudAs_Ajjrxri6OHx96',
    },
    5: {
        id: '0x5',
        token: 'ETH',
        label: 'Ethereum Goerli Testnet',
        rpcUrl: 'https://eth-goerli.g.alchemy.com/v2/xzGPKdnYRJOJ8b2rwhhIBt-4zbaFMtVe',
    },
};

export const NETWORKS = {
    1: {
        ...NETWORKS_ONBOARD[1],
        safeServiceURL: 'https://safe-transaction-mainnet.safe.global/',
        safeLink: 'https://app.safe.global/eth:',
        agreementArbitrator: '',
        poster: '0x000000000000cd17345801aa8147b8D3950260FF',
    },
    5: {
        ...NETWORKS_ONBOARD[5],
        safeServiceURL: 'https://safe-transaction-goerli.safe.global/',
        safeLink: 'https://app.safe.global/gor:',
        agreementArbitrator: '0x9b5c78d4e5ae9700ec402ae5e4c557ffbcb09367',
        poster: '0x000000000000cd17345801aa8147b8D3950260FF',
    },
};

export const ChainIDs = {
    MAINNET: 1,
    GOERLI: 5,
} as const;

export const DEFAULT_NETWORK = ChainIDs.GOERLI;

export type ChainID = keyof typeof NETWORKS;

export const NETWORKS_ONBOARD_ARRAY = Object.values(NETWORKS_ONBOARD);
