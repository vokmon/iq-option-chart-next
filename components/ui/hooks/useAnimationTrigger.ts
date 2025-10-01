import { useEffect, useState } from "react";

export function useAnimationTrigger<T>(dependency: T) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [dependency]);

  return isAnimating;
}
