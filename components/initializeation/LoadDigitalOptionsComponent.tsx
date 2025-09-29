"use client";

import { useDigitalOptions } from "@/hooks/useDigitalOptions";
import { useGetActiveInformation } from "@/hooks/useGetActiveInformation";

export default function LoadDigitalOptionsComponent() {
  useDigitalOptions();
  useGetActiveInformation();
  return null;
}
