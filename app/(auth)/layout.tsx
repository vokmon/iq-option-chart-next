import LoadDigitalOptionsComponent from "@/components/initializeation/LoadDigitalOptionsComponent";
import AppToolbar from "@/components/layout/navigation/AppToolbar";
import { SdkProvider } from "@/provider/SdkProvider";
import { Flex } from "@mantine/core";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SdkProvider>
      <LoadDigitalOptionsComponent />
      <Flex w="100%" h="100%" direction="column">
        <AppToolbar />
        <Flex w="100%" h="100%" flex={1}>
          {children}
        </Flex>
      </Flex>
    </SdkProvider>
  );
}
