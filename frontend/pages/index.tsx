import Head from "next/head";
import { isConnected, useWeb3 } from "@/components/state/useWeb3";
import {
  Box,
  Button,
  Text,
  Heading,
  HStack,
  Spacer,
  Center,
  Stack,
} from "@chakra-ui/react";

const PageLayout = ({ children }: { children: React.ReactNode }) => (
  <Box maxW="1100px" px="20" py="8" flex="1" minH="100vh">
    {children}
  </Box>
);

export default function Home() {
  const web3 = useWeb3();
  return (
    <>
      <Head>
        <title>Contractooor</title>
        <meta
          name="description"
          content="Stream tokens based on legal agreements"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Center w="100%">
        <PageLayout>
          <HStack>
            <Heading>Contractooor</Heading>
            <Spacer />
            {!isConnected(web3) && (
              <Button onClick={() => web3.connect()}>Connect</Button>
            )}
          </HStack>
          <Box height="100%" >
            <Stack maxW="630px">
              <Heading
                fontSize={["36px", "36px", "72px"]}
                lineHeight={["36px", "36px", "72px"]}
              >
                Streaming equity from Safe to Safe
              </Heading>
              <Text fontWeight={500} fontSize="24px">
                Contractooor enables on-chain agreements between service
                providers and decentralized autonomous organizations
              </Text>
            </Stack>

            <Stack w="100%" alignItems={"center"}>
              <Button w={"360px"}>Connect as a Safe</Button>
              <Button w={"360px"}>Connect as a Wallet</Button>
            </Stack>
          </Box>
        </PageLayout>
      </Center>
    </>
  );
}
