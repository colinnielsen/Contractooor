import { Web3Provider } from '@/lib/state/useWeb3';
import { ChakraProvider } from '@chakra-ui/react';
import { Web3OnboardProvider } from '@web3-onboard/react';
import web3Onboard from '@/lib/state/web3init';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Web3OnboardProvider web3Onboard={web3Onboard}>
            <Web3Provider>
                <ChakraProvider>
                    <Component {...pageProps} />
                </ChakraProvider>
            </Web3Provider>
        </Web3OnboardProvider>
    );
}
