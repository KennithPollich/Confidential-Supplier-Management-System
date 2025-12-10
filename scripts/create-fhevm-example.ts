#!/usr/bin/env ts-node
/**
 * FHEVM Example Generator
 * Generates standalone FHEVM example repositories from template
 *
 * Usage:
 *   ts-node scripts/create-fhevm-example.ts <example-name> [output-path]
 *
 * Examples:
 *   ts-node scripts/create-fhevm-example.ts fhe-counter ./output
 *   ts-node scripts/create-fhevm-example.ts confidential-supplier-management ./examples
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Example registry with metadata
const EXAMPLES_MAP: Record<
  string,
  {
    name: string;
    description: string;
    category: string;
    contractFile: string;
    testFile: string;
    complexity: string;
    keywords: string[];
    documentation: {
      overview: string;
      keyFeatures: string[];
      learningOutcomes: string[];
    };
  }
> = {
  "confidential-supplier-management": {
    name: "Confidential Supplier Management System",
    description:
      "Privacy-preserving supplier management with encrypted ratings and comparisons",
    category: "enterprise",
    contractFile: "SupplierManagement.sol",
    testFile: "SupplierManagement.ts",
    complexity: "advanced",
    keywords: ["access-control", "privacy", "enterprise", "supplier-management"],
    documentation: {
      overview:
        "Demonstrates FHE-based supplier management with encrypted ratings, access control, and privacy-preserving operations.",
      keyFeatures: [
        "Encrypted supplier ratings (euint8)",
        "Privacy-preserving comparisons",
        "Owner-only decryption access",
        "Async callback-based decryption",
        "Proper FHE permission handling",
      ],
      learningOutcomes: [
        "How to encrypt sensitive business data",
        "Managing permissions for encrypted values",
        "Implementing access control patterns",
        "Async decryption workflows",
        "Real-world enterprise applications of FHE",
      ],
    },
  },
  "fhe-counter": {
    name: "FHE Counter",
    description: "Simple encrypted counter demonstrating basic FHE operations",
    category: "basic",
    contractFile: "FHECounter.sol",
    testFile: "FHECounter.ts",
    complexity: "beginner",
    keywords: ["counter", "arithmetic", "encryption"],
    documentation: {
      overview: "Demonstrates simple FHE counter with increment and decrement operations.",
      keyFeatures: [
        "Encrypted counter state",
        "Arithmetic operations on encrypted values",
        "Basic permission handling",
        "Event logging",
      ],
      learningOutcomes: [
        "How to work with encrypted integers",
        "Basic FHE operations (add, subtract)",
        "Permission management",
        "Testing FHE contracts",
      ],
    },
  },
};

interface ExampleConfig {
  name: string;
  description: string;
  category: string;
  contractFile: string;
  testFile: string;
  complexity: string;
  keywords: string[];
  documentation: {
    overview: string;
    keyFeatures: string[];
    learningOutcomes: string[];
  };
}

/**
 * Create a standalone FHEVM example repository
 */
async function createExample(exampleName: string, outputPath: string): Promise<void> {
  const config: ExampleConfig | undefined = EXAMPLES_MAP[exampleName];

  if (!config) {
    console.error(`❌ Example not found: ${exampleName}`);
    console.log(`Available examples: ${Object.keys(EXAMPLES_MAP).join(", ")}`);
    process.exit(1);
  }

  console.log(`\n📦 Creating FHEVM Example: ${config.name}`);
  console.log(`📍 Output: ${outputPath}\n`);

  try {
    // 1. Create output directory
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
      console.log(`✅ Created directory: ${outputPath}`);
    }

    // 2. Copy base template
    const templatePath = path.join(__dirname, "../base-template");
    copyDirectory(templatePath, outputPath);
    console.log(`✅ Copied base template`);

    // 3. Copy contract file
    const contractSrc = path.join(__dirname, "../contracts", config.contractFile);
    if (fs.existsSync(contractSrc)) {
      const contractDest = path.join(outputPath, "contracts", config.contractFile);
      fs.copyFileSync(contractSrc, contractDest);
      console.log(`✅ Copied contract: ${config.contractFile}`);
    }

    // 4. Copy test file
    const testSrc = path.join(__dirname, "../test", config.testFile);
    if (fs.existsSync(testSrc)) {
      const testDest = path.join(outputPath, "test", config.testFile);
      fs.copyFileSync(testSrc, testDest);
      console.log(`✅ Copied test: ${config.testFile}`);
    }

    // 5. Update package.json
    updatePackageJson(outputPath, exampleName, config);
    console.log(`✅ Updated package.json`);

    // 6. Generate README
    generateReadme(outputPath, exampleName, config);
    console.log(`✅ Generated README.md`);

    // 7. Create metadata file
    createMetadata(outputPath, exampleName, config);
    console.log(`✅ Created example metadata`);

    console.log(`\n✅ Example created successfully!\n`);
    console.log(`Next steps:`);
    console.log(`  cd ${outputPath}`);
    console.log(`  npm install`);
    console.log(`  npm run compile`);
    console.log(`  npm run test`);
  } catch (error) {
    console.error(`❌ Error creating example:`, error);
    process.exit(1);
  }
}

/**
 * Copy directory recursively
 */
function copyDirectory(src: string, dest: string): void {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Skip node_modules, artifacts, cache
    if (["node_modules", "artifacts", "cache", ".git"].includes(entry.name)) {
      continue;
    }

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Update package.json with example-specific metadata
 */
function updatePackageJson(outputPath: string, exampleName: string, config: ExampleConfig): void {
  const packageJsonPath = path.join(outputPath, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  packageJson.name = exampleName.replace(/_/g, "-");
  packageJson.description = config.description;
  packageJson.keywords = config.keywords;

  // Add example metadata
  packageJson.fhevmExample = {
    name: config.name,
    category: config.category,
    complexity: config.complexity,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

/**
 * Generate README.md for the example
 */
function generateReadme(outputPath: string, exampleName: string, config: ExampleConfig): void {
  const readme = `# ${config.name}

## Overview

${config.documentation.overview}

## Complexity Level
**${config.complexity.toUpperCase()}**

## Key Features

${config.documentation.keyFeatures.map((feature) => `- ${feature}`).join("\n")}

## Learning Outcomes

${config.documentation.learningOutcomes.map((outcome) => `- ${outcome}`).join("\n")}

## Quick Start

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
npm run deploy:sepolia
\`\`\`

## Files

- **Contract**: \`contracts/${config.contractFile}\`
- **Tests**: \`test/${config.testFile}\`
- **Deployment**: \`scripts/deploy.ts\`

## Category
**${config.category.charAt(0).toUpperCase() + config.category.slice(1)}**

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/)
- [Zama Community](https://www.zama.ai/community)

---

Generated: ${new Date().toISOString()}
`;

  fs.writeFileSync(path.join(outputPath, "README.md"), readme);
}

/**
 * Create example metadata file
 */
function createMetadata(
  outputPath: string,
  exampleName: string,
  config: ExampleConfig
): void {
  const metadata = {
    id: exampleName,
    name: config.name,
    description: config.description,
    category: config.category,
    complexity: config.complexity,
    keywords: config.keywords,
    contractFile: config.contractFile,
    testFile: config.testFile,
    generatedAt: new Date().toISOString(),
    documentation: config.documentation,
  };

  fs.writeFileSync(
    path.join(outputPath, ".fhevm-example.json"),
    JSON.stringify(metadata, null, 2)
  );
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage: ts-node scripts/create-fhevm-example.ts <example-name> [output-path]");
    console.log("\nAvailable examples:");
    Object.entries(EXAMPLES_MAP).forEach(([key, config]) => {
      console.log(`  ${key.padEnd(35)} - ${config.description}`);
    });
    process.exit(0);
  }

  const exampleName = args[0];
  const outputPath = args[1] || `./${exampleName}-example`;

  await createExample(exampleName, outputPath);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

export { createExample, EXAMPLES_MAP };
