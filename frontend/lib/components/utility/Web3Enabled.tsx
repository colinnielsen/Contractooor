import React from "react";

import { isConnected, useWeb3 } from "../../state/useWeb3";

export const Web3Enabled = ({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  const web3 = useWeb3();

  return <>{isConnected(web3) ? children : fallback}</>;
};
