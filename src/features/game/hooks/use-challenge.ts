"use client";

import { useState, useCallback } from "react";
import type { Challenge, ValidationResult } from "@/lib/game/dojo/types";
import { getValidator } from "@/lib/game/dojo/levels/level-0-setup/validators";

export type ChallengeState =
  | "instruction"
  | "input"
  | "validating"
  | "success"
  | "error";

export interface UseChallengeOptions {
  challenge: Challenge | null;
  onComplete?: (challengeId: string, xp: number) => void;
}

export interface UseChallengeReturn {
  // State
  state: ChallengeState;
  inputValue: string;
  validationResult: ValidationResult | null;

  // Actions
  setInputValue: (value: string) => void;
  submitInput: () => void;
  acknowledgeSuccess: () => void;
  retry: () => void;
}

/**
 * Hook for managing individual challenge state
 */
export function useChallenge({
  challenge,
  onComplete,
}: UseChallengeOptions): UseChallengeReturn {
  const [state, setState] = useState<ChallengeState>("instruction");
  const [inputValue, setInputValue] = useState("");
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);

  // Submit input for validation
  const submitInput = useCallback(() => {
    if (!challenge) return;

    setState("validating");

    // Get the validator for this challenge
    const validate = getValidator(challenge.id);

    if (!validate) {
      // No validator - just accept it (for confirm type)
      setValidationResult({ valid: true });
      setState("success");
      return;
    }

    // Run validation
    const result = validate(inputValue);
    setValidationResult(result);

    if (result.valid) {
      setState("success");
    } else {
      setState("error");
    }
  }, [challenge, inputValue]);

  // Acknowledge success and trigger completion
  const acknowledgeSuccess = useCallback(() => {
    if (challenge && onComplete) {
      onComplete(challenge.id, challenge.xpReward);
    }
    // Reset for next challenge
    setState("instruction");
    setInputValue("");
    setValidationResult(null);
  }, [challenge, onComplete]);

  // Retry after error
  const retry = useCallback(() => {
    setState("input");
    setValidationResult(null);
  }, []);

  // Auto-transition to input when challenge type is terminal-paste
  const handleSetInputValue = useCallback(
    (value: string) => {
      if (state === "instruction") {
        setState("input");
      }
      setInputValue(value);
    },
    [state]
  );

  return {
    state,
    inputValue,
    validationResult,
    setInputValue: handleSetInputValue,
    submitInput,
    acknowledgeSuccess,
    retry,
  };
}
