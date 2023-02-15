import { ChainIDs, DEFAULT_NETWORK } from "@/components/constants/networks";
import { PageLayout } from "@/components/page";
import { ConnectedEOA, isConnected, useWeb3 } from "@/components/state/useWeb3";
import { Stack, Text, Fade, Button, Box } from "@chakra-ui/react";
import { useSetChain } from "@web3-onboard/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Create() {
  const router = useRouter();
  const web3 = useWeb3();
  const [, setChain] = useSetChain();

  const [loginState, setLoginState] = useState<"initial" | "login" | "safe">(
    "initial"
  );
  const [safes, setSafes] = useState<string[] | { error: string } | "init">(
    "init"
  );

  const fetchSafes = useCallback(async () => {
    if (isConnected(web3)) {
      try {
        const { safes } =
          await web3.walletConnection.safeServiceClient.getSafesByOwner(
            web3.walletConnection.address
          );
        console.log(safes);
        setSafes(safes);
      } catch (e: any) {
        setSafes({ error: e.message });
      }
    }
  }, [web3]);

  useEffect(() => {
    fetchSafes();
  }, [web3.walletConnection, fetchSafes]);

  return (
    <PageLayout>
      <Stack flex="1" display="flex" justifyContent={"center"}>
        <Stack w="100%" alignItems={"center"} pos="relative">
          <Fade
            in={loginState === "initial"}
            style={{ position: "absolute" }}
            unmountOnExit
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
              <Button w={"360px"} onClick={() => web3.functions.connectEOA()}>
                Connect as a Wallet
              </Button>
            </Stack>
          </Fade>

          <Fade
            in={loginState === "safe" && !(safes instanceof Array)}
            style={{ position: "absolute" }}
            unmountOnExit
          >
            <Stack align={"center"}>
              <Text>Connect with your wallet to view your Safes</Text>
              <Button
                w={"360px"}
                onClick={async () => {
                  if (web3.walletConnection === "unsupported-network") {
                    setChain({ chainId: "0x" + DEFAULT_NETWORK.toString(16) });
                  } else {
                    web3.functions.connectEOA().then(fetchSafes);
                  }
                }}
              >
                {web3.walletConnection === "unsupported-network"
                  ? "Switch Network"
                  : "Connect"}
              </Button>
            </Stack>
          </Fade>
          <Button
            maxW={"min-content"}
            alignSelf="start"
            justifySelf={"flex-start"}
            onClick={() =>
              setLoginState((prev) => {
                if (prev == "initial" || prev == "login") return "initial";
                web3.functions.disconnect({ label: "MetaMask" });
                return "login";
              })
            }
          >
            Back
          </Button>
          <Fade
            in={safes instanceof Array}
            style={{ position: "absolute" }}
            unmountOnExit
          >
            {safes instanceof Array && isConnected(web3) && (
              <Stack align={"center"}>
                <Text>
                  {safes.length > 0
                    ? "Choose a Safe to connect with"
                    : "No Safes found, switch account"}
                </Text>
                {safes.map((safe) => (
                  <Button
                    key={safe}
                    onClick={() => {
                      if (web3.walletConnection.walletType === "EOA") {
                        web3.functions.connectSafe(web3.walletConnection, safe);
                        
                      }
                    }}
                  >
                    {safe}
                  </Button>
                ))}
              </Stack>
            )}
          </Fade>
        </Stack>

        <Box h="75px" />
        <Box h="10px" />
      </Stack>
    </PageLayout>
  );
}
