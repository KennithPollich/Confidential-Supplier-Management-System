#!/usr/bin/env ts-node
/**
 * FHEVM Documentation Generator
 * Generates GitBook-compatible documentation from contracts and tests
 *
 * Usage:
 *   ts-node scripts/generate-docs.ts <example-name>
 *   ts-node scripts/generate-docs.ts --all
 *
 * Examples:
 *   ts-node scripts/generate-docs.ts fhe-counter
 *   ts-node scripts/generate-docs.ts confidential-supplier-management
 *   ts-node scripts/generate-docs.ts --all
 */

import fs from "fs";
import path from "path";
import { EXAMPLES_MAP } from "./create-fhevm-example";

interface DocumentationConfig {
  contractPath: string;
  testPath: string;
  outputPath: string;
  category: string;
  complexity: string;
  estimatedTime: string;
}

const DOCS_CONFIG: Record<string, DocumentationConfig> = {
  "confidential-supplier-management": {
    contractPath: "./contracts/SupplierManagement.sol",
    testPath: "./test/SupplierManagement.ts",
    outputPath: "./docs/enterprise/confidential-supplier-management.md",
    category: "enterprise",
    complexity: "advanced",
    estimatedTime: "30-45 minutes",
  },
  "fhe-counter": {
    contractPath: "./contracts/EncryptedContract.sol",
    testPath: "./test/EncryptedContract.ts",
    outputPath: "./docs/basic/fhe-counter.md",
    category: "basic",
    complexity: "beginner",
    estimatedTime: "15-20 minutes",
  },
};

/**
 * Extract contract comments and code
 */
function extractContractInfo(filePath: string): { comments: string; code: string } {
  if (!fs.existsSync(filePath)) {
    return { comments: "", code: "" };
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  let comments = "";
  let code = "";
  let inComment = false;

  for (const line of lines) {
    if (line.includes("/**")) {
      inComment = true;
    }

    if (inComment) {
      comments += line + "\n";
      if (line.includes("*/")) {
        inComment = false;
      }
    } else {
      code += line + "\n";
    }
  }

  return { comments, code };
}

/**
 * Extract test information
 */
function extractTestInfo(filePath: string): { testCases: string[]; coverage: string } {
  if (!fs.existsSync(filePath)) {
    return { testCases: [], coverage: "" };
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const testRegex = /it\(['"`]([^'"`]+)['"`]/g;
  const testCases: string[] = [];
  let match;

  while ((match = testRegex.exec(content)) !== null) {
    testCases.push(match[1]);
  }

  return {
    testCases,
    coverage: `Total test cases: ${testCases.length}`,
  };
}

/**
 * Generate documentation for an example
 */
function generateDocumentation(exampleName: string, outputDir: string): void {
  const exampleConfig = EXAMPLES_MAP[exampleName];
  const docsConfig = DOCS_CONFIG[exampleName];

  if (!exampleConfig) {
    console.error(`❌ Example not found: ${exampleName}`);
    process.exit(1);
  }

  if (!docsConfig) {
    console.warn(`⚠️  Documentation config not found for: ${exampleName}`);
    console.warn("Using default configuration...");
  }

  console.log(`\n📚 Generating Documentation for: ${exampleConfig.name}`);

  // Extract information
  const contractInfo = extractContractInfo(docsConfig?.contractPath || "");
  const testInfo = extractTestInfo(docsConfig?.testPath || "");

  // Create output directory
  const outputPath = docsConfig?.outputPath || `./docs/${exampleName}.md`;
  const outputDirPath = path.dirname(outputPath);
  if (!fs.existsSync(outputDirPath)) {
    fs.mkdirSync(outputDirPath, { recursive: true });
  }

  // Generate markdown
  const markdown = `# ${exampleConfig.name}

**Category**: ${exampleConfig.category}
**Complexity**: ${docsConfig?.complexity || "intermediate"}
**Estimated Time**: ${docsConfig?.estimatedTime || "20-30 minutes"}

## Overview

${exampleConfig.documentation.overview}

## Key Features

${exampleConfig.documentation.keyFeatures.map((f) => `- ${f}`).join("\n")}

## Learning Outcomes

${exampleConfig.documentation.learningOutcomes.map((o) => `- ${o}`).join("\n")}

## Architecture

### Contract Structure

The contract is organized into the following main sections:

1. **State Variables** - Storage for encrypted and public data
2. **Constructor/Initialization** - Setup logic
3. **Core Functions** - Main contract functionality
4. **Utility Functions** - Helper methods
5. **Events** - Important events for monitoring

### Key FHE Operations

This example demonstrates:
- Encrypted data types (\`euint8\`, \`euint32\`, etc.)
- Permission management (\`FHE.allowThis()\`, \`FHE.allow()\`)
- Privacy-preserving operations
- Async decryption callbacks

## Code Examples

### Contract File
\`\`\`solidity
// Source: ${docsConfig?.contractPath || "contracts/[Example].sol"}
// See the contract file for complete implementation
\`\`\`

### Test Cases

**Total Tests**: ${testInfo.testCases.length}

${
  testInfo.testCases.length > 0
    ? `
Test coverage includes:
${testInfo.testCases.map((test) => `- ${test}`).join("\n")}
`
    : "See test file for detailed test cases"
}

## How It Works

### Step 1: Setup
Initialize the contract and prepare any encrypted data structures.

### Step 2: Encrypt Data
Use FHE to encrypt sensitive information:
\`\`\`solidity
euint8 encryptedValue = FHE.asEuint8(plainValue);
FHE.allowThis(encryptedValue);
FHE.allow(encryptedValue, msg.sender);
\`\`\`

### Step 3: Perform Operations
Execute functions that operate on encrypted data:
\`\`\`solidity
// Examples: add, subtract, compare, etc.
\`\`\`

### Step 4: Decrypt (if needed)
Request decryption through async callback:
\`\`\`solidity
FHE.requestDecryption(cts, this.callback.selector);
\`\`\`

## Running the Example

### Prerequisites
- Node.js >= 14.0.0
- npm or yarn

### Installation
\`\`\`bash
npm install
\`\`\`

### Compilation
\`\`\`bash
npm run compile
\`\`\`

### Testing
\`\`\`bash
npm run test
\`\`\`

### Deployment
\`\`\`bash
# Deploy to Sepolia testnet
npm run deploy:sepolia

# Deploy to Zama testnet
npm run deploy:zama
\`\`\`

## FHE Patterns Used

### Pattern 1: Permission Management
\`\`\`solidity
euint8 encryptedValue = FHE.asEuint8(plainValue);
FHE.allowThis(encryptedValue);              // ✅ Contract permission
FHE.allow(encryptedValue, msg.sender);      // ✅ User permission
\`\`\`

### Pattern 2: Access Control
\`\`\`solidity
require(msg.sender == owner, "Only owner can decrypt");
\`\`\`

### Pattern 3: Encrypted Operations
\`\`\`solidity
euint8 result = FHE.add(encryptedA, encryptedB);
\`\`\`

### Pattern 4: Async Decryption
\`\`\`solidity
FHE.requestDecryption(cts, this.processDecryption.selector);
\`\`\`

## Common Pitfalls

### ❌ Forgetting FHE.allowThis()
\`\`\`solidity
// WRONG - missing allowThis
FHE.allow(encryptedValue, msg.sender);
\`\`\`

### ✅ Correct Permission Handling
\`\`\`solidity
// RIGHT - both permissions
FHE.allowThis(encryptedValue);
FHE.allow(encryptedValue, msg.sender);
\`\`\`

### ❌ View Functions with Encrypted Returns
\`\`\`solidity
// WRONG - can't return encrypted from view
function getValue() external view returns (euint8) {
    return encryptedValue;
}
\`\`\`

## Advanced Topics

### State Management
How encrypted values are stored and updated in contract state.

### Multi-Step Operations
Performing complex logic with encrypted values.

### Decryption Callbacks
Understanding async decryption and callback pattern.

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Guide](https://hardhat.org/)
- [Solidity Handbook](https://docs.soliditylang.org/)
- [Zama Community](https://www.zama.ai/community)

## Next Steps

1. ✅ Complete this example
2. Review related examples in the same category
3. Modify the contract to test different scenarios
4. Deploy to testnet
5. Explore more advanced patterns

## Questions?

- Visit [Zama Community Forum](https://www.zama.ai/community)
- Check [FHEVM Documentation](https://docs.zama.ai/fhevm)
- Ask on [Zama Discord](https://discord.com/invite/zama)

---

**Last Updated**: ${new Date().toISOString()}
**Example**: ${exampleName}
**Version**: 1.0.0
`;

  fs.writeFileSync(outputPath, markdown);
  console.log(`✅ Documentation generated: ${outputPath}`);
}

/**
 * Generate all documentation
 */
function generateAllDocumentation(outputDir: string): void {
  console.log(`\n📚 Generating all documentation...\n`);

  for (const exampleName of Object.keys(EXAMPLES_MAP)) {
    try {
      generateDocumentation(exampleName, outputDir);
    } catch (error) {
      console.warn(`⚠️  Failed to generate docs for ${exampleName}:`, error);
    }
  }

  // Generate SUMMARY.md
  generateSummary(outputDir);
}

/**
 * Generate GitBook SUMMARY.md
 */
function generateSummary(outputDir: string): void {
  const summary = `# Summary

## Getting Started
* [Introduction](README.md)

## Enterprise Applications
${Object.entries(EXAMPLES_MAP)
  .filter(([_, config]) => config.category === "enterprise")
  .map(([name, config]) => `* [${config.name}](enterprise/${name}.md)`)
  .join("\n")}

## Basic Examples
${Object.entries(EXAMPLES_MAP)
  .filter(([_, config]) => config.category === "basic")
  .map(([name, config]) => `* [${config.name}](basic/${name}.md)`)
  .join("\n")}

## Resources
* [FHEVM Documentation](https://docs.zama.ai/fhevm)
* [Hardhat Guide](https://hardhat.org/)
* [Zama Community](https://www.zama.ai/community)
`;

  const summaryPath = path.join(outputDir, "docs", "SUMMARY.md");
  const summaryDir = path.dirname(summaryPath);
  if (!fs.existsSync(summaryDir)) {
    fs.mkdirSync(summaryDir, { recursive: true });
  }

  fs.writeFileSync(summaryPath, summary);
  console.log(`✅ SUMMARY.md generated: ${summaryPath}`);
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage: ts-node scripts/generate-docs.ts <example-name|--all> [output-dir]");
    console.log("\nAvailable examples:");
    Object.entries(EXAMPLES_MAP).forEach(([key, config]) => {
      console.log(`  ${key.padEnd(35)} - ${config.description}`);
    });
    process.exit(0);
  }

  const outputDir = args[1] || "./docs";

  if (args[0] === "--all") {
    generateAllDocumentation(outputDir);
    console.log(`\n✅ All documentation generated in: ${outputDir}`);
  } else {
    const exampleName = args[0];
    generateDocumentation(exampleName, outputDir);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

export { generateDocumentation, generateAllDocumentation };
