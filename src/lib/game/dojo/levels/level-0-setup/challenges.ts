import type { Challenge } from "../../types";

export const level0Challenges: Challenge[] = [
  {
    id: "node-version",
    type: "terminal-paste",
    instruction:
      "Let's start with Node.js - the JavaScript runtime that powers everything.",
    helpText: `To install Node.js:

1. Go to nodejs.org
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the prompts
4. Restart your terminal after installation

Once installed, continue to verify your installation.`,
    helpLink: "https://nodejs.org",
    helpLinkText: "Download Node.js",
    command: "node --version",
    validation: {
      pattern: /v(\d+)\.(\d+)\.(\d+)/,
      minVersion: "18.0.0",
      errorMessage:
        "Node.js version 18.0.0 or higher is required. Download the latest LTS version from nodejs.org and restart your terminal.",
    },
    successMessage: "Node.js detected. A solid foundation for what comes next.",
    xpReward: 10,
  },
  {
    id: "npm-version",
    type: "terminal-paste",
    instruction: "npm (Node Package Manager) comes bundled with Node.js.",
    helpText: `npm should already be installed if you have Node.js.

If npm is missing or outdated, update it with:
npm install -g npm@latest

Then, continue to verify your installation`,
    command: "npm --version",
    validation: {
      pattern: /(\d+)\.(\d+)\.(\d+)/,
      minVersion: "9.0.0",
      errorMessage:
        "npm version 9.0.0 or higher is required. Update with: npm install -g npm@latest",
    },
    successMessage: "npm is ready. Your arsenal of packages awaits.",
    xpReward: 10,
  },
  {
    id: "cursor-version",
    type: "terminal-paste",
    instruction: "Now let's set up Cursor - your AI-powered code editor.",
    helpText: `To install Cursor:

1. Go to cursor.com
2. Download for your operating system
3. Install and open Cursor
4. Open the integrated terminal (Ctrl+\` or Cmd+\`)

Continue to verify that Cursor is installed in your machine.`,
    helpLink: "https://cursor.com",
    helpLinkText: "Download Cursor",
    command: "cursor --version",
    validation: {
      pattern: /(\d+)\.(\d+)\.(\d+)/,
      errorMessage:
        'Could not verify Cursor. Make sure Cursor is installed and added to your PATH. On Mac, open Cursor and run "Shell Command: Install cursor command" from the command palette (Cmd+Shift+P).',
    },
    successMessage:
      "Cursor IDE confirmed. The AI shall be your ally in battle.",
    xpReward: 10,
  },
];

export const LEVEL_0_TOTAL_XP = level0Challenges.reduce(
  (total, challenge) => total + challenge.xpReward,
  0
);
