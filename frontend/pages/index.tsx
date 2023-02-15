import { PageLayout } from "@/components/page";
import { useWeb3 } from "@/components/state/useWeb3";
import {
  Box,
  Button,
  Fade,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  useDimensions,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

export default function Home() {
  const router = useRouter();
  const web3 = useWeb3();
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
            <Button w={"360px"} onClick={() => router.push("/create")}>
              Create An Agreement
            </Button>
            <Button w={"360px"} isDisabled>
              View Agreements
            </Button>
          </Stack>

          <Box h="75px" />
          <Box h="10px" />
        </Stack>
      </PageLayout>
    </>
  );
}
