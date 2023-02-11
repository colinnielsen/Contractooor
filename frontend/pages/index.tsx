import Head from "next/head";
import {
  isConenctionSucessful,
  isConnected,
  useWeb3,
} from "@/components/state/useWeb3";
import {
  Box,
  Button,
  Text,
  Heading,
  HStack,
  Spacer,
  Center,
  Stack,
  Fade,
  useDisclosure,
  useDimensions,
  Flex,
  Container,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRouter } from "next/router";

const PageLayout = ({ children }: { children: React.ReactNode }) => (
  <Flex
    w="100%"
    px="20"
    py="8"
    minH="100vh"
    flexDir={"column"}
    flexWrap="nowrap"
  >
    <Flex
      maxW={"1100px"}
      flex="1"
      flexDir={"column"}
      flexWrap="nowrap"
      h="100%"
    >
      {children}
    </Flex>
  </Flex>
);

export default function Home() {
  const router = useRouter();
  const web3 = useWeb3();
  const [loginState, setLoginState] = useState<"initial" | "login" | "safe">(
    "initial"
  );
  const ref = useRef(null);
  const dimensions = useDimensions(ref);

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
      <PageLayout>
        <HStack>
          <Heading>Contractooor</Heading>
        </HStack>
        <Stack flex="1" display="flex" justifyContent={"center"}>
          <Box maxW="630px">
            <Heading
              fontSize={["36px", "36px", "72px"]}
              lineHeight={["36px", "36px", "72px"]}
            >
              Streaming equity from Safe to Safe
            </Heading>
            <Text fontWeight={500} fontSize="24px">
              Contractooor enables on-chain agreements between service providers
              and decentralized autonomous organizations
            </Text>
          </Box>
          <Box h="50px" />

          <Stack
            w="100%"
            alignItems={"center"}
            pos="relative"
            height={dimensions?.borderBox.height ?? "initial"}
          >
            <Fade
              in={loginState === "initial"}
              style={{ position: "absolute" }}
              unmountOnExit
              ref={ref}
            >
              <Stack align={"center"}>
                <Button w={"360px"} onClick={() => setLoginState("login")}>
                  Create An Agreement
                </Button>
                <Button w={"360px"} isDisabled>
                  View Agreements
                </Button>
              </Stack>
            </Fade>

            <Fade
              in={loginState === "login"}
              unmountOnExit
              style={{ position: "absolute" }}
            >
              <Stack align={"center"}>
                <Button w={"360px"} onClick={() => setLoginState("safe")}>
                  Connect as a Safe
                </Button>
                <Button
                  w={"360px"}
                  onClick={() =>
                    web3
                      .connect()
                      .then(isConenctionSucessful)
                      .then((success) => success && router.push("/create"))
                  }
                >
                  Connect as a Wallet
                </Button>
                <Button
                  maxW={"min-content"}
                  onClick={() => setLoginState("initial")}
                >
                  Back
                </Button>
              </Stack>
            </Fade>

            <Fade
              in={loginState === "safe"}
              style={{ position: "absolute" }}
              unmountOnExit
            >
              <Stack align={"center"}>
                <Text>Connect with your wallet to view your Safes</Text>
                <Button
                  w={"360px"}
                  onClick={() => web3.connect().then(isConenctionSucessful)}
                >
                  Connect
                </Button>
                <Button
                  maxW={"min-content"}
                  onClick={() => setLoginState("login")}
                >
                  Back
                </Button>
              </Stack>
            </Fade>
          </Stack>
          <Box h="75px" />
          <Box h="10px" />
        </Stack>
      </PageLayout>
    </>
  );
}
