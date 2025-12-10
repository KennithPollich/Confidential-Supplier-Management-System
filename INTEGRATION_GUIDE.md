# Integration Guide - Automation & Scaffolding

## Overview

This guide explains how to integrate the Confidential Supplier Management System into FHEVM example generation tools and automation frameworks.

---

## Part 1: Example Registration

### 1.1 Adding to `create-fhevm-example.ts`

Register the example in your automation script:

```typescript
// scripts/create-fhevm-example.ts

const EXAMPLES_MAP = {
  // ... existing examples ...

  'confidential-supplier-management': {
    name: 'Confidential Supplier Management System',
    description: 'Privacy-preserving supplier management with FHE encryption',
    category: 'enterprise',
    keywords: ['access-control', 'privacy', 'supplier-management', 'enterprise'],
    contractFile: 'SupplierManagement.sol',
    testFile: 'SupplierManagement.ts',
    complexity: 'advanced',
    duration: 'Medium',
    tags: {
      'chapter': 'access-control',
      'concepts': ['encrypted-storage', 'permission-management', 'privacy-preserving-operations'],
      'patterns': ['async-decryption', 'owner-based-access-control'],
    },
    documentation: {
      overview: 'Demonstrates FHE-based supplier management with encrypted ratings.',
      keyFeatures: [
        'Encrypted supplier ratings (euint8)',
        'Privacy-preserving comparisons',
        'Owner-only decryption access',
        'Async callback-based decryption',
        'Proper FHE permission handling',
      ],
      learningOutcomes: [
        'How to encrypt sensitive business data',
        'Managing permissions for encrypted values',
        'Implementing access control patterns',
        'Async decryption workflows',
        'Real-world enterprise applications of FHE',
      ],
    },
  },
};
```

### 1.2 Adding to `create-fhevm-category.ts`

Register for category-based generation:

```typescript
// scripts/create-fhevm-category.ts

const CATEGORIES = {
  // ... existing categories ...

  enterprise: {
    name: 'Enterprise Applications',
    description: 'Production-grade FHE examples for business applications',
    examples: [
      'confidential-supplier-management',
      'confidential-voting-system',     // Future example
      'private-auction',                 // Future example
      'encrypted-document-management',   // Future example
    ],
    keyTopics: [
      'Privacy-preserving business logic',
      'Access control patterns',
      'Enterprise data protection',
      'Real-world FHE applications',
    ],
  },
};
```

### 1.3 Source File Placement

Organize files for automated access:

```
your-project/
├── contracts/
│   └── enterprise/
│       └── SupplierManagement.sol
├── test/
│   └── enterprise/
│       └── SupplierManagement.ts
├── docs/
│   └── enterprise/
│       └── confidential-supplier-management.md
└── scripts/
    └── config/
        └── examples-registry.json
```

---

## Part 2: File Structure for Scaffolding

### 2.1 Contract File Format

Prepare the contract with metadata comments:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title Confidential Supplier Management System
 * @notice Privacy-preserving supplier management using FHE
 * @dev Demonstrates access control, encrypted storage, and privacy-preserving operations
 * @category enterprise
 * @complexity advanced
 *
 * ## Overview
 * This contract shows how to build a supplier management system where:
 * - Supplier ratings are encrypted and protected from public view
 * - Only authorized parties (owners) can decrypt rating information
 * - Comparisons between suppliers happen on encrypted data
 * - All operations maintain privacy while supporting business logic
 *
 * ## Key Concepts
 * - **FHE Encryption**: euint8 for encrypted ratings
 * - **Access Control**: Owner-based permissions
 * - **Async Decryption**: Callback-based decryption pattern
 * - **Privacy-Preserving Operations**: Comparisons without revealing values
 *
 * ## Use Case
 * Enterprise supply chain management where supplier performance data
 * must remain confidential while enabling decision-making.
 */
contract SupplierManagement is SepoliaConfig {
    // ... contract implementation ...
}
```

### 2.2 Test File Format

Structure tests with metadata:

```typescript
// test/enterprise/SupplierManagement.ts

import { expect } from "chai";
import { ethers } from "hardhat";
import { SupplierManagement } from "../typechain";

/**
 * Test Suite: Confidential Supplier Management
 * Category: enterprise
 * Chapter: access-control, privacy-preserving-operations
 *
 * ## Test Coverage
 * This suite demonstrates:
 * 1. How to add suppliers with encrypted data
 * 2. Access control enforcement
 * 3. Privacy-preserving operations
 * 4. Decryption request workflows
 */

describe("SupplierManagement", function () {
  let contract: SupplierManagement;
  let owner: any;
  let other: any;

  beforeEach(async function () {
    // Test setup with detailed comments
  });

  describe("Supplier Management - Access Control", function () {
    it("✅ CORRECT: Owner can add supplier with encrypted rating", async function () {
      // Demonstrates correct pattern
      const tx = await contract.connect(owner).addSupplier(
        "Supplier A",
        "Electronics",
        "contact@supplier.com",
        8, // rating
        false
      );

      expect(tx).to.emit(contract, "SupplierAdded");
    });

    it("❌ INCORRECT: Non-owner cannot update supplier rating", async function () {
      // Demonstrates common mistake
      await contract.connect(owner).addSupplier(
        "Supplier B",
        "Electronics",
        "contact@supplier.com",
        7,
        false
      );

      // This should fail - only owner can update
      await expect(
        contract.connect(other).updateSupplierRating(1, 9)
      ).to.be.revertedWith("Only owner can update");
    });
  });

  describe("Encrypted Operations - Privacy", function () {
    it("✅ CORRECT: Rating comparison preserves privacy", async function () {
      // Add two suppliers
      await contract.connect(owner).addSupplier(
        "Supplier 1",
        "Category1",
        "contact1@supplier.com",
        8,
        false
      );

      await contract.connect(owner).addSupplier(
        "Supplier 2",
        "Category2",
        "contact2@supplier.com",
        6,
        false
      );

      // Compare without revealing actual ratings
      const result = await contract.compareSupplierRatings(1, 2);
      expect(result).to.be.true;
    });
  });

  describe("Decryption - Async Callbacks", function () {
    it("✅ CORRECT: Owner can request rating decryption", async function () {
      // Add supplier
      await contract.connect(owner).addSupplier(
        "Supplier",
        "Category",
        "contact@supplier.com",
        9,
        false
      );

      // Request decryption (will emit RatingDecrypted event)
      const tx = await contract
        .connect(owner)
        .requestRatingDecryption(1);

      expect(tx).to.emit(contract, "RatingDecrypted");
    });
  });
});
```

---

## Part 3: Documentation Generation Template

### 3.1 Auto-Generated Documentation Structure

```markdown
# Confidential Supplier Management System

## Overview
[Auto-generated from contract JSDoc comments]

## Concepts Demonstrated
- Access Control with FHE
- Encrypted Data Storage
- Privacy-Preserving Operations
- Async Decryption Callbacks

## How It Works

### 1. Adding a Supplier
[Code snippet from contract]

### 2. Encrypted Rating
[Explanation of euint8 and FHE.asEuint8]

### 3. Privacy-Preserving Comparison
[How comparisons work without decryption]

### 4. Async Decryption
[Callback pattern explanation]

## Code Examples

### Adding a Supplier
\`\`\`typescript
const tx = await contract.addSupplier(
  "Supplier Name",
  "Category",
  "contact@email.com",
  8,  // Rating 1-10
  false  // Not preferred initially
);
\`\`\`

### Requesting Decryption
\`\`\`typescript
await contract.requestRatingDecryption(supplierId);
\`\`\`

## Running Tests
\`\`\`bash
npm run test -- test/enterprise/SupplierManagement.ts
\`\`\`

## Key Files
- Contract: `contracts/enterprise/SupplierManagement.sol`
- Tests: `test/enterprise/SupplierManagement.ts`
- Deploy: `scripts/deploy.ts`

## Next Steps
[Learning path suggestions]
```

### 3.2 Documentation Generator Integration

Add to `generate-docs.ts`:

```typescript
// scripts/generate-docs.ts

const EXAMPLES_CONFIG = {
  // ... existing examples ...

  'confidential-supplier-management': {
    contractPath: './contracts/enterprise/SupplierManagement.sol',
    testPath: './test/enterprise/SupplierManagement.ts',
    outputPath: './docs/enterprise/confidential-supplier-management.md',

    sections: {
      overview: {
        template: 'standard',
        title: 'Confidential Supplier Management System',
        useContractComments: true,
      },
      concepts: {
        title: 'Core Concepts',
        items: [
          'Access Control',
          'FHE Encryption',
          'Privacy-Preserving Operations',
          'Async Decryption',
        ],
      },
      patterns: {
        title: 'FHE Patterns Demonstrated',
        includeCode: true,
        highlights: [
          'FHE.asEuint8()',
          'FHE.allowThis()',
          'FHE.allow()',
          'FHE.requestDecryption()',
        ],
      },
      testing: {
        title: 'Test Coverage',
        extractFrom: 'test file',
        groups: [
          'Access Control',
          'Privacy Operations',
          'Decryption',
        ],
      },
    },

    metadata: {
      category: 'enterprise',
      complexity: 'advanced',
      estimatedTime: '30-45 minutes',
      prerequisites: [
        'Understanding of FHE basics',
        'Solidity knowledge',
        'Hardhat familiarity',
      ],
    },
  },
};

// Usage in generator
async function generateDocumentation(exampleName: string) {
  const config = EXAMPLES_CONFIG[exampleName];
  // ... generate markdown from config ...
}
```

---

## Part 4: GitBook Integration

### 4.1 SUMMARY.md Entry

Add to GitBook SUMMARY:

```markdown
# Summary

## Getting Started
* [Installation](getting-started/installation.md)
* [Quick Start](getting-started/quick-start.md)

## Enterprise Applications
* [Confidential Supplier Management](enterprise/confidential-supplier-management.md)
  * [Overview](enterprise/confidential-supplier-management.md#overview)
  * [Concepts](enterprise/confidential-supplier-management.md#concepts)
  * [Implementation](enterprise/confidential-supplier-management.md#implementation)
  * [Running Tests](enterprise/confidential-supplier-management.md#running-tests)
  * [Deployment](enterprise/confidential-supplier-management.md#deployment)

## Advanced Topics
* [Access Control Patterns](advanced/access-control.md)
* [Privacy-Preserving Operations](advanced/privacy-operations.md)
```

### 4.2 GitBook Configuration

```json
{
  "gitbook": "3.2.3",
  "title": "FHEVM Enterprise Examples",
  "description": "Production-grade FHE implementations for business applications",
  "author": "Your Organization",
  "language": "en",
  "structure": {
    "readme": "README.md",
    "summary": "SUMMARY.md"
  },
  "plugins": [
    "search",
    "highlight",
    "-lunr"
  ],
  "pluginsConfig": {
    "search": {
      "maxIndexSize": 3000000
    }
  }
}
```

---

## Part 5: Repository Scaffolding Template

### 5.1 Generated Repository Structure

When scaffolded, creates this structure:

```
confidential-supplier-management/
├── contracts/
│   └── SupplierManagement.sol
├── test/
│   └── SupplierManagement.ts
├── scripts/
│   ├── deploy.ts
│   └── helpers.ts
├── hardhat.config.ts
├── tsconfig.json
├── package.json
├── README.md
├── .gitignore
├── .env.example
├── docs/
│   └── DEPLOYMENT.md
└── artifacts/
    └── [compiled contracts]
```

### 5.2 Generated package.json

```json
{
  "name": "confidential-supplier-management",
  "version": "1.0.0",
  "description": "Privacy-preserving supplier management system using FHEVM",
  "main": "index.js",
  "scripts": {
    "compile": "hardhat compile",
    "test": "hardhat test",
    "test:coverage": "hardhat coverage",
    "deploy": "hardhat run scripts/deploy.ts",
    "deploy:sepolia": "hardhat run scripts/deploy.ts --network sepolia",
    "lint": "solhint 'contracts/**/*.sol'"
  },
  "keywords": [
    "fhevm",
    "privacy",
    "encryption",
    "enterprise",
    "supplier-management"
  ],
  "dependencies": {
    "@fhevm/solidity": "^0.7.0",
    "ethers": "^5.7.2",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "@fhevm/hardhat-plugin": "0.0.1-3",
    "@nomicfoundation/hardhat-toolbox": "^2.0.0",
    "hardhat": "^2.24.3",
    "typescript": "^4.9.0",
    "ts-node": "^10.9.0"
  }
}
```

### 5.3 Generated README.md

Auto-generated from metadata and contract comments:

```markdown
# Confidential Supplier Management System

## Quick Start

\`\`\`bash
npm install
npm run compile
npm run test
npm run deploy:sepolia
\`\`\`

## Overview

This project demonstrates a privacy-preserving supplier management system...

## Features

- Encrypted supplier ratings
- Privacy-preserving comparisons
- Owner-only decryption
- Async callback decryption
- Complete access control

## Architecture

[Auto-generated from contract structure]

## Deployment

\`\`\`bash
npx hardhat run scripts/deploy.ts --network sepolia
\`\`\`

## Testing

\`\`\`bash
npx hardhat test
\`\`\`

## Learn More

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Guide](https://hardhat.org/)
```

---

## Part 6: Metadata & Tagging System

### 6.1 Example Metadata File

Create `examples-metadata.json`:

```json
{
  "confidential-supplier-management": {
    "id": "confidential-supplier-management",
    "name": "Confidential Supplier Management System",
    "description": "Privacy-preserving supplier management with FHE encryption",
    "category": "enterprise",
    "subcategory": "business-applications",
    "complexity": "advanced",
    "estimatedTime": "30-45 minutes",

    "concepts": [
      "access-control",
      "encrypted-storage",
      "privacy-preserving-operations",
      "async-decryption"
    ],

    "patterns": [
      "FHE.asEuint8",
      "FHE.allowThis",
      "FHE.allow",
      "FHE.requestDecryption",
      "owner-based-access-control",
      "callback-based-decryption"
    ],

    "useCase": "enterprise-supply-chain",
    "realWorldApplications": [
      "Supplier evaluation systems",
      "Confidential vendor management",
      "Privacy-preserving comparisons"
    ],

    "prerequisites": [
      "Solidity fundamentals",
      "Understanding of FHE basics",
      "Hardhat experience"
    ],

    "learningOutcomes": [
      "How to encrypt sensitive business data",
      "Implementing access control with encrypted values",
      "Using async decryption callbacks",
      "Building privacy-preserving comparisons"
    ],

    "relatedExamples": [
      "confidential-voting-system",
      "private-auction",
      "encrypted-document-management"
    ],

    "difficulty": "5/5",
    "interactivity": "5/5",
    "clarity": "5/5"
  }
}
```

### 6.2 Tagging in Source Code

Add tags in contract and test files:

```solidity
// @tag: access-control
// @tag: privacy-preserving-operations
// @tag: enterprise-application
// @concept: encrypted-storage
// @pattern: FHE.allowThis, FHE.allow
function addSupplier(...) external {
    // Implementation
}
```

---

## Part 7: Deployment Automation

### 7.1 Deploy Script Generation

Generated `scripts/deploy.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying from account: ${deployer.address}`);

  // Deploy SupplierManagement
  const SupplierManagement = await ethers.getContractFactory(
    "SupplierManagement"
  );
  const contract = await SupplierManagement.deploy();
  await contract.deployed();

  console.log(`SupplierManagement deployed to: ${contract.address}`);

  // Verify on Etherscan
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("Verifying contract...");
    await contract.deployTransaction.wait(6);
    // Verification code
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

---

## Part 8: Testing & Validation

### 8.1 Generated Test Validation

Script to validate scaffolded examples:

```typescript
// scripts/validate-example.ts

async function validateExample(exampleName: string) {
  console.log(`Validating: ${exampleName}`);

  // 1. Compile
  const compileResult = await runCommand("npm run compile");
  if (!compileResult.success) {
    throw new Error("Compilation failed");
  }

  // 2. Run tests
  const testResult = await runCommand("npm run test");
  if (!testResult.success) {
    throw new Error("Tests failed");
  }

  // 3. Check coverage
  const coverage = await runCommand("npm run test:coverage");

  console.log(`✅ ${exampleName} validation passed`);
  return true;
}
```

---

## Part 9: Integration Checklist

### Pre-Integration
- [ ] Contract compiles without errors
- [ ] Tests pass (100% success rate)
- [ ] Documentation is complete
- [ ] Metadata is accurate
- [ ] Example is self-contained
- [ ] File paths are correct

### Integration Steps
- [ ] Register in EXAMPLES_MAP
- [ ] Add to appropriate CATEGORIES
- [ ] Place files in correct directories
- [ ] Update metadata JSON
- [ ] Generate documentation
- [ ] Test scaffolding script
- [ ] Verify generated repo works
- [ ] Update SUMMARY.md

### Post-Integration
- [ ] Test with create-fhevm-example
- [ ] Test with create-fhevm-category
- [ ] Verify documentation generation
- [ ] Check GitBook rendering
- [ ] Test deployment script
- [ ] Validate all tests pass
- [ ] Confirm examples/documentation structure

---

## Part 10: Continuous Integration

### 10.1 CI/CD Configuration

Example GitHub Actions workflow:

```yaml
name: Validate Examples

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Compile contracts
        run: npm run compile

      - name: Run tests
        run: npm run test

      - name: Generate documentation
        run: npm run generate-docs

      - name: Validate scaffolding
        run: |
          npm run create-example confidential-supplier-management test-output
          cd test-output
          npm install && npm run compile && npm run test
```

---

## Summary

This integration guide provides:

✅ Step-by-step registration in automation tools
✅ File structure and format specifications
✅ Documentation generation configuration
✅ Metadata and tagging system
✅ Scaffolding and deployment automation
✅ Testing and validation procedures
✅ GitBook integration
✅ CI/CD configuration

**Result**: The Confidential Supplier Management System becomes a fully integrated, automatically-scaffoldable FHEVM example that can be generated and deployed instantly.

---

*For questions about integration, refer to the main project documentation and automation script source code.*
