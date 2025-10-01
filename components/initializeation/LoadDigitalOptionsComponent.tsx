"use client";

import { useDigitalOptions } from "@/hooks/assets/useDigitalOptions";
import { useGetActiveInformation } from "@/hooks/assets/useGetActiveInformation";

export default function LoadDigitalOptionsComponent() {
  useDigitalOptions();
  useGetActiveInformation();
  return null;
}
