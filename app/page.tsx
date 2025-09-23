"use client";
import { MantineProvider } from "@mantine/core";
import HomePage from "../components/Home.page";
import { SdkProvider } from "../provider/SdkProvider";

export default function Home() {
  return (
    <SdkProvider>
      <MantineProvider>
        <HomePage />
      </MantineProvider>
    </SdkProvider>
  );
}
