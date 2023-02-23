import injectedModule from '@web3-onboard/injected-wallets';
import { init } from '@web3-onboard/react';
import { NETWORKS_ONBOARD_ARRAY } from '../constants/networks';

const injected = injectedModule();

export default init({
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
