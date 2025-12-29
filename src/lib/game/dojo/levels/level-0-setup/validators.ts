import type { ValidationResult } from "../../types";

/**
 * Parse a semantic version string and return major, minor, patch numbers
 */
function parseVersion(
  versionStr: string
): { major: number; minor: number; patch: number } | null {
  const match = versionStr.match(/v?(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

/**
 * Compare two versions: returns true if actual >= required
 */
function isVersionSufficient(actual: string, required: string): boolean {
  const actualVersion = parseVersion(actual);
  const requiredVersion = parseVersion(required);

  if (!actualVersion || !requiredVersion) return false;

  if (actualVersion.major > requiredVersion.major) return true;
  if (actualVersion.major < requiredVersion.major) return false;

  if (actualVersion.minor > requiredVersion.minor) return true;
  if (actualVersion.minor < requiredVersion.minor) return false;

  return actualVersion.patch >= requiredVersion.patch;
}

/**
 * Validate Node.js version output
 * Expected format: v20.10.0 or similar
 * Minimum required: 18.0.0
 */
export function validateNodeVersion(output: string): ValidationResult {
  const trimmed = output.trim();
  const match = trimmed.match(/v(\d+\.\d+\.\d+)/);

  if (!match) {
    return {
      valid: false,
      error:
        "Could not find Node.js version in your output. Make sure you ran 'node --version' and pasted the complete output.",
    };
  }

  const version = match[1];
  const minVersion = "18.0.0";

  if (!isVersionSufficient(version, minVersion)) {
    return {
      valid: false,
      extractedValue: version,
      error: `Node.js version ${version} detected, but version ${minVersion} or higher is required. Please upgrade Node.js.`,
    };
  }

  return {
    valid: true,
    extractedValue: version,
  };
}

/**
 * Validate npm version output
 * Expected format: 10.2.3 or similar
 * Minimum required: 9.0.0
 */
export function validateNpmVersion(output: string): ValidationResult {
  const trimmed = output.trim();
  const match = trimmed.match(/(\d+\.\d+\.\d+)/);

  if (!match) {
    return {
      valid: false,
      error:
        "Could not find npm version in your output. Make sure you ran 'npm --version' and pasted the complete output.",
    };
  }

  const version = match[1];
  const minVersion = "9.0.0";

  if (!isVersionSufficient(version, minVersion)) {
    return {
      valid: false,
      extractedValue: version,
      error: `npm version ${version} detected, but version ${minVersion} or higher is required. Please upgrade npm with: npm install -g npm@latest`,
    };
  }

  return {
    valid: true,
    extractedValue: version,
  };
}

/**
 * Validate Cursor IDE version output
 * More lenient - just needs version pattern or "Cursor" text
 */
export function validateCursorVersion(output: string): ValidationResult {
  const trimmed = output.trim().toLowerCase();

  // Check for version pattern
  const versionMatch = trimmed.match(/(\d+\.\d+\.\d+)/);
  if (versionMatch) {
    return {
      valid: true,
      extractedValue: versionMatch[1],
    };
  }

  // Check for "cursor" text
  if (trimmed.includes("cursor")) {
    return {
      valid: true,
      extractedValue: "detected",
    };
  }

  return {
    valid: false,
    error:
      "Could not verify Cursor IDE. Make sure Cursor is installed and you ran 'cursor --version' in your terminal.",
  };
}

/**
 * Get the validator function for a challenge by ID
 */
export function getValidator(
  challengeId: string
): ((output: string) => ValidationResult) | null {
  const validators: Record<string, (output: string) => ValidationResult> = {
    "node-version": validateNodeVersion,
    "npm-version": validateNpmVersion,
    "cursor-version": validateCursorVersion,
  };

  return validators[challengeId] || null;
}
