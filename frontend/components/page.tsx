import { Flex, Heading, HStack } from "@chakra-ui/react";

export const PageLayout = ({
  children,
  omitHeader,
}: {
  children: React.ReactNode;
  omitHeader?: boolean;
}) => (
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
      {!omitHeader && (
        <HStack>
          <Heading>Contractooor</Heading>
        </HStack>
      )}
      {children}
    </Flex>
  </Flex>
);
