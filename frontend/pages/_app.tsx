import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { Web3Provider } from "@/state/useWeb3";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3Provider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </Web3Provider>
  );
}
