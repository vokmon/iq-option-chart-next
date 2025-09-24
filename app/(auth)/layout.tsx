import { SdkProvider } from "@/provider/SdkProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SdkProvider>{children}</SdkProvider>;
}
