import React from 'react';

import { isWeb3Connected, useWeb3 } from '../../state/useWeb3';

export const Web3Enabled = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => {
    const web3 = useWeb3();

    return <>{isWeb3Connected(web3) ? children : fallback}</>;
};
