import { IconArrowRight } from "@tabler/icons-react";
import React from "react";

export default function AssetSelectorAttentions() {
  return (
    <div className="absolute top-3 -left-15">
      <IconArrowRight
        size={56}
        className="text-orange-500 drop-shadow-lg animate-pulse hover:animate-bounce transition-all duration-300 hover:scale-110"
        style={{
          filter: "drop-shadow(0 4px 8px rgba(249, 115, 22, 0.3))",
          animation: "wiggle 2s ease-in-out infinite",
        }}
      />
      <div
        className="absolute inset-0 animate-ping"
        style={{
          animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        }}
      >
        <IconArrowRight size={32} className="text-orange-400 opacity-20" />
      </div>
    </div>
  );
}
