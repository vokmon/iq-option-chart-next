import { useState, useEffect } from "react";

export function useWindowWidth(offset: number = 0) {
  const [width, setWidth] = useState(() => {
    if (typeof window !== "undefined") {
      return Math.max(window.innerWidth - offset, 500);
    }
    return 500; // fallback for SSR
  });

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth - offset);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [offset]);

  return width;
}
