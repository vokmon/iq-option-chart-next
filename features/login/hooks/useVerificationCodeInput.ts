import { useState, useRef, useCallback } from "react";

export const useVerificationCodeInput = (
  onCodeComplete: (code: string) => void
) => {
  const [code, setCode] = useState<string[]>(new Array(5).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = useCallback(
    (index: number, value: string) => {
      // Only allow single digit
      if (value.length > 1) return;

      // Only allow numbers
      if (value && !/^\d$/.test(value)) return;

      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 4) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all fields are filled
      if (newCode.every((digit) => digit !== "") && !newCode.includes("")) {
        onCodeComplete(newCode.join(""));
      }
    },
    [code, onCodeComplete]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [code]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedData = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 5);
      const newCode = [...code];

      for (let i = 0; i < pastedData.length && i < 5; i++) {
        newCode[i] = pastedData[i];
      }

      setCode(newCode);

      // Focus the next empty field or the last field
      const nextEmptyIndex = newCode.findIndex((digit) => digit === "");
      const focusIndex = nextEmptyIndex === -1 ? 4 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
    },
    [code]
  );

  const resetCode = useCallback(() => {
    setCode(new Array(5).fill(""));
    inputRefs.current[0]?.focus();
  }, []);

  const focusFirstInput = useCallback(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const isCodeComplete = code.every((digit) => digit !== "");

  return {
    code,
    inputRefs,
    handleInputChange,
    handleKeyDown,
    handlePaste,
    resetCode,
    focusFirstInput,
    isCodeComplete,
  };
};
