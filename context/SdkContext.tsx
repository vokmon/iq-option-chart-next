"use client";
import { createContext } from "react";
import { ClientSdk } from "@quadcode-tech/client-sdk-js";

export const SdkContext = createContext<ClientSdk | null>(null);
