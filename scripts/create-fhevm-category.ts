#!/usr/bin/env ts-node
/**
 * FHEVM Category Generator
 * Generates category-based FHEVM example repositories
 *
 * Usage:
 *   ts-node scripts/create-fhevm-category.ts <category> [output-path]
 *
 * Examples:
 *   ts-node scripts/create-fhevm-category.ts enterprise ./examples
 *   ts-node scripts/create-fhevm-category.ts basic ./basic-examples
 */

import fs from "fs";
import path from "path";
import { EXAMPLES_MAP } from "./create-fhevm-example";

// Category definitions
const CATEGORIES: Record<
  string,
  {
    name: string;
    description: string;
    examples: string[];
    keyTopics: string[];
  }
> = {
  enterprise: {
    name: "Enterprise Applications",
    description: "Production-grade FHE examples for business applications",
    examples: ["confidential-supplier-management"],
    keyTopics: [
      "Privacy-preserving business logic",
      "Access control patterns",
      "Enterprise data protection",
      "Real-world FHE applications",
    ],
  },
  basic: {
    name: "Basic Examples",
    description: "Foundational FHEVM concepts and operations",
    examples: ["fhe-counter"],
    keyTopics: [
      "Encryption basics",
      "Arithmetic operations",
      "Permission management",
      "Testing FHE contracts",
    ],
  },
};

interface CategoryConfig {
  name: string;
  description: string;
  examples: string[];
  keyTopics: string[];
}

/**
 * Create a category-based FHEVM example repository
 */
async function createCategory(categoryName: string, outputPath: string): Promise<void> {
  const config: CategoryConfig | undefined = CATEGORIES[categoryName];

  if (!config) {
    console.error(`❌ Category not found: ${categoryName}`);
    console.log(`Available categories: ${Object.keys(CATEGORIES).join(", ")}`);
    process.exit(1);
  }

  console.log(`\n📦 Creating FHEVM Category: ${config.name}`);
  console.log(`📍 Output: ${outputPath}`);
  console.log(`📚 Examples: ${config.examples.length}\n`);

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

    // 3. Create contracts directory
    const contractsDir = path.join(outputPath, "contracts");
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir, { recursive: true });
    }

    // 4. Create test directory
    const testDir = path.join(outputPath, "test");
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    // 5. Copy all example contracts and tests
    const contractFiles: string[] = [];
    const testFiles: string[] = [];

    for (const exampleName of config.examples) {
      const exampleConfig = EXAMPLES_MAP[exampleName];
      if (!exampleConfig) {
        console.warn(`⚠️  Example not found: ${exampleName}`);
        continue;
      }

      // Copy contract
      const contractSrc = path.join(__dirname, "../contracts", exampleConfig.contractFile);
      if (fs.existsSync(contractSrc)) {
        const contractDest = path.join(contractsDir, exampleConfig.contractFile);
        fs.copyFileSync(contractSrc, contractDest);
        contractFiles.push(exampleConfig.contractFile);
      }

      // Copy test
      const testSrc = path.join(__dirname, "../test", exampleConfig.testFile);
      if (fs.existsSync(testSrc)) {
        const testDest = path.join(testDir, exampleConfig.testFile);
        fs.copyFileSync(testSrc, testDest);
        testFiles.push(exampleConfig.testFile);
      }
    }

    console.log(`✅ Copied ${contractFiles.length} contracts`);
    console.log(`✅ Copied ${testFiles.length} tests`);

    // 6. Update package.json
    updatePackageJson(outputPath, categoryName, config);
    console.log(`✅ Updated package.json`);

    // 7. Generate README
    generateReadme(outputPath, categoryName, config, contractFiles, testFiles);
    console.log(`✅ Generated README.md`);

    // 8. Create metadata
    createMetadata(outputPath, categoryName, config);
    console.log(`✅ Created category metadata`);

    // 9. Generate unified deployment script
    generateDeploymentScript(outputPath, contractFiles);
    console.log(`✅ Generated deployment script`);

    console.log(`\n✅ Category created successfully!\n`);
    console.log(`Next steps:`);
    console.log(`  cd ${outputPath}`);
    console.log(`  npm install`);
    console.log(`  npm run compile`);
    console.log(`  npm run test`);
    console.log(`  npm run deploy:sepolia`);
  } catch (error) {
    console.error(`❌ Error creating category:`, error);
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

    if (["node_modules", "artifacts", "cache", ".git", "contracts", "test"].includes(entry.name)) {
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
 * Update package.json for category
 */
function updatePackageJson(outputPath: string, categoryName: string, config: CategoryConfig): void {
  const packageJsonPath = path.join(outputPath, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  packageJson.name = `fhevm-${categoryName}-examples`;
  packageJson.description = config.description;
  packageJson.keywords = [categoryName, "fhevm", "examples"];

  packageJson.fhevmCategory = {
    name: config.name,
    category: categoryName,
    examples: config.examples.length,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

/**
 * Generate README for category
 */
function generateReadme(
  outputPath: string,
  categoryName: string,
  config: CategoryConfig,
  contractFiles: string[],
  testFiles: string[]
): void {
  const readme = `# ${config.name}

## Overview

${config.description}

## Key Topics

${config.keyTopics.map((topic) => `- ${topic}`).join("\n")}

## Included Examples

${config.examples
  .map((example) => {
    const exampleConfig = EXAMPLES_MAP[example];
    return `### ${exampleConfig?.name || example}
${exampleConfig?.description || ""}

- **Contract**: \`contracts/${exampleConfig?.contractFile}\`
- **Tests**: \`test/${exampleConfig?.testFile}\`
`;
  })
  .join("\n")}

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

## Project Structure

\`\`\`
contracts/
${contractFiles.map((f) => `  ├── ${f}`).join("\n")}
test/
${testFiles.map((f) => `  ├── ${f}`).join("\n")}
scripts/
  ├── deploy.ts
  └── helpers.ts
hardhat.config.ts
package.json
README.md
\`\`\`

## Learning Path

1. Start with the first example
2. Review the contract comments
3. Study the test cases
4. Run the tests locally
5. Deploy to testnet
6. Experiment with modifications

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
 * Create category metadata
 */
function createMetadata(outputPath: string, categoryName: string, config: CategoryConfig): void {
  const metadata = {
    category: categoryName,
    name: config.name,
    description: config.description,
    examples: config.examples,
    keyTopics: config.keyTopics,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(outputPath, ".fhevm-category.json"),
    JSON.stringify(metadata, null, 2)
  );
}

/**
 * Generate unified deployment script
 */
function generateDeploymentScript(outputPath: string, contractFiles: string[]): void {
  const contractNames = contractFiles.map((f) => f.replace(".sol", ""));

  const script = `import { ethers } from "hardhat";

/**
 * Deployment script for ${contractNames.join(", ")}
 */
async function main() {
  console.log("Starting deployment of category examples...");

  const network = await ethers.provider.getNetwork();
  const [deployer] = await ethers.getSigners();

  console.log(\`Network: \${network.name} (Chain ID: \${network.chainId})\`);
  console.log(\`Deployer: \${deployer.address}\`);

  const deployedContracts: Record<string, string> = {};

  ${contractNames
    .map((name) => {
      return `
  // Deploy ${name}
  console.log("\\nDeploying ${name}...");
  const ${name}Factory = await ethers.getContractFactory("${name}");
  const ${name}Instance = await ${name}Factory.deploy();
  await ${name}Instance.deployed();
  deployedContracts["${name}"] = ${name}Instance.address;
  console.log(\`✅ ${name} deployed to: \${${name}Instance.address}\`);`;
    })
    .join("\n")}

  console.log("\\n✅ All contracts deployed successfully!");
  console.log(JSON.stringify(deployedContracts, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
`;

  fs.writeFileSync(path.join(outputPath, "scripts", "deploy.ts"), script);
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage: ts-node scripts/create-fhevm-category.ts <category> [output-path]");
    console.log("\nAvailable categories:");
    Object.entries(CATEGORIES).forEach(([key, config]) => {
      console.log(`  ${key.padEnd(15)} - ${config.description} (${config.examples.length} examples)`);
    });
    process.exit(0);
  }

  const categoryName = args[0];
  const outputPath = args[1] || `./${categoryName}-examples`;

  await createCategory(categoryName, outputPath);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

export { createCategory, CATEGORIES };
