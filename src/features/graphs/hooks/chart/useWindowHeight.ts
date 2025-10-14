import { useState, useEffect } from "react";

export function useWindowHeight(offset: number = 0) {
  const [height, setHeight] = useState(() => {
    if (typeof window !== "undefined") {
      return Math.max(window.innerHeight - offset, 250);
    }
    return 400; // fallback for SSR
  });

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight - offset);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [offset]);

  return height;
}
