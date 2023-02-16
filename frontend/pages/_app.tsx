import { Web3Provider } from '@/lib/state/useWeb3';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Web3Provider>
            <ChakraProvider>
                <Component {...pageProps} />
            </ChakraProvider>
        </Web3Provider>
    );
}
