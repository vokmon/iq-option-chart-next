import LoadDigitalOptionsComponent from "@/components/initializeation/LoadDigitalOptionsComponent";
import LoadPositionsDataComponent from "@/components/initializeation/LoadPositionsDataComponent";
import AppToolbar from "@/components/layout/navigation/AppToolbar";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { SdkProvider } from "@/provider/SdkProvider";
import { Flex } from "@mantine/core";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SdkProvider>
      <LoadDigitalOptionsComponent />
      <LoadPositionsDataComponent />
      <Flex w="100%" h="100%" direction="column">
        <AppToolbar />
        <Flex
          w="100%"
          // h="100%"
          flex={1}
          className="bg-gradient-to-r from-[rgba(28,34,51,1)] to-[rgba(18,22,33,0.85)]"
        >
          {children}
          <InstallPrompt />
        </Flex>
      </Flex>
    </SdkProvider>
  );
}
