import { Flex, Heading, HStack, Spacer } from "@chakra-ui/react";
import { WalletCard } from "./base/WalletState";

export const PageLayout = ({
  children,
  omitHeader,
  omitWalletInfo
}: {
  children: React.ReactNode;
  omitHeader?: boolean;
  omitWalletInfo?: boolean;
}) => (
  <Flex
    w="100%"
    px="20"
    py="8"
    minH="100vh"
    flexDir={"column"}
    flexWrap="nowrap"
  >
    <Flex flex="1" flexDir={"column"} flexWrap="nowrap" h="100%">
      {!omitHeader && (
        <HStack>
          <Heading>Contractooor</Heading>
          <Spacer />
          {!omitWalletInfo && <WalletCard />}
        </HStack>
      )}
      {children}
    </Flex>
  </Flex>
);
