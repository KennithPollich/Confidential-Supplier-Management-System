# Developer Guide - FHEVM Example Creation & Maintenance

A comprehensive guide for developers on how to create, maintain, and extend FHEVM examples and automation tools.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Setting Up Your Environment](#setting-up-your-environment)
3. [Creating a New Example](#creating-a-new-example)
4. [Adding Examples to Automation Tools](#adding-examples-to-automation-tools)
5. [Updating Dependencies](#updating-dependencies)
6. [Documentation Best Practices](#documentation-best-practices)
7. [Testing Standards](#testing-standards)
8. [Deployment Procedures](#deployment-procedures)
9. [Troubleshooting](#troubleshooting)
10. [Contributing Guidelines](#contributing-guidelines)

---

## Project Overview

### Architecture

This FHEVM example project consists of:

```
SupplierManagement/
├── base-template/              # Hardhat template foundation
│   ├── contracts/
│   ├── test/
│   ├── scripts/
│   ├── hardhat.config.ts
│   └── package.json
├── contracts/                  # Example contracts
│   ├── SupplierManagement.sol
│   └── [other examples]
├── test/                       # Test files
│   ├── SupplierManagement.ts
│   └── [other examples]
├── scripts/                    # Automation tools
│   ├── create-fhevm-example.ts
│   ├── create-fhevm-category.ts
│   ├── generate-docs.ts
│   └── deploy.ts
├── docs/                       # Generated documentation
└── DEVELOPER_GUIDE.md          # This file
```

### Key Components

**Base Template** (`base-template/`)
- Standard Hardhat setup with FHEVM support
- Can be cloned and customized for new examples
- Includes all necessary dependencies and configurations

**Automation Scripts** (`scripts/`)
- `create-fhevm-example.ts` - Generates standalone examples
- `create-fhevm-category.ts` - Creates category collections
- `generate-docs.ts` - Produces documentation

**Examples** (`contracts/` and `test/`)
- Each example demonstrates specific FHE concepts
- Includes contract code and comprehensive tests
- Well-documented with inline comments

---

## Setting Up Your Environment

### Prerequisites

```bash
# Node.js version
node --version  # Must be >= 14.0.0

# npm version
npm --version   # Should be >= 6.0.0
```

### Installation

1. **Clone or navigate to project:**
```bash
cd SupplierManagement
```

2. **Install dependencies:**
```bash
npm install
```

3. **Verify installation:**
```bash
npm run compile
npm run test
```

4. **Set up environment variables:**
```bash
cp base-template/.env.example .env
# Edit .env with your keys
```

### IDE Setup

**Recommended: VS Code**

Extensions:
- Solidity (Juan Blanco) - Smart contract syntax highlighting
- Hardhat (nomicfoundation) - Hardhat integration
- TypeScript - Built-in support

Configuration (`.vscode/settings.json`):
```json
{
  "solidity.defaultCompiler": "remote",
  "[solidity]": {
    "editor.defaultFormatter": "JuanBlanco.solidity",
    "editor.formatOnSave": true
  }
}
```

---

## Creating a New Example

### Step 1: Create Contract File

Create a new Solidity contract in `contracts/`:

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint8 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title Your Example Name
 * @notice Clear description of what this example demonstrates
 * @dev Implementation details and FHE concepts shown
 *
 * ## Key Concepts
 * - Concept 1
 * - Concept 2
 *
 * ## Use Cases
 * - Use case 1
 * - Use case 2
 */
contract YourExample is SepoliaConfig {
    // Implementation
}
```

**Key Requirements:**
- ✅ Clear JSDoc comments at contract level
- ✅ Comment each function explaining FHE usage
- ✅ Include inline comments for complex logic
- ✅ Follow naming conventions (CamelCase for contracts)
- ✅ Use proper FHE permission patterns

### Step 2: Create Test File

Create comprehensive tests in `test/`:

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { YourExample } from "../typechain-types";

/**
 * Test Suite: Your Example
 * Demonstrates:
 * - Correct FHE usage patterns
 * - Common pitfalls and how to avoid them
 * - Edge cases and error conditions
 */
describe("YourExample", function () {
  let contract: YourExample;
  let owner: any;
  let other: any;

  beforeEach(async function () {
    // Setup
  });

  describe("Main Functionality", function () {
    it("✅ CORRECT: Should work as expected", async function () {
      // Test correct behavior
    });

    it("❌ INCORRECT: Should handle errors properly", async function () {
      // Test error handling
    });
  });
});
```

**Test Requirements:**
- ✅ Use ✅/❌ markers for correct/incorrect patterns
- ✅ Test both success and failure cases
- ✅ Include edge case testing
- ✅ Verify access control
- ✅ Test FHE operations

### Step 3: Add Documentation

Create detailed comments:

```solidity
/**
 * @dev Perform FHE operation
 * @param _value Input value to encrypt
 * @return result Encrypted result
 *
 * ## Process
 * 1. Encrypt input value
 * 2. Grant permissions (allowThis + allow)
 * 3. Perform operation
 * 4. Return encrypted result
 *
 * @notice This pattern ensures both contract and user permissions
 */
function yourFunction(uint8 _value) external returns (euint8) {
    euint8 encrypted = FHE.asEuint8(_value);
    FHE.allowThis(encrypted);
    FHE.allow(encrypted, msg.sender);
    return encrypted;
}
```

### Step 4: Register in Automation Scripts

**In `scripts/create-fhevm-example.ts`:**

```typescript
const EXAMPLES_MAP = {
  // ... existing examples ...

  'your-example-name': {
    name: 'Your Example Name',
    description: 'Description of what this example demonstrates',
    category: 'category-name',  // enterprise, basic, etc.
    contractFile: 'YourExample.sol',
    testFile: 'YourExample.ts',
    complexity: 'beginner|intermediate|advanced',
    keywords: ['keyword1', 'keyword2'],
    documentation: {
      overview: 'Detailed overview of the example',
      keyFeatures: [
        'Feature 1',
        'Feature 2'
      ],
      learningOutcomes: [
        'Outcome 1',
        'Outcome 2'
      ]
    }
  }
};
```

### Step 5: Test the Example

```bash
# Compile
npm run compile

# Run tests
npm run test -- test/YourExample.ts

# Generate documentation
ts-node scripts/generate-docs.ts your-example-name

# Test scaffolding
ts-node scripts/create-fhevm-example.ts your-example-name ./test-output
cd test-output
npm install
npm run test
```

---

## Adding Examples to Automation Tools

### For create-fhevm-category.ts

Update `scripts/create-fhevm-category.ts`:

```typescript
const CATEGORIES = {
  'your-category': {
    name: 'Your Category Name',
    description: 'Category description',
    examples: [
      'example-name-1',
      'example-name-2',
      'your-example-name'  // Add your example
    ],
    keyTopics: [
      'Topic 1',
      'Topic 2'
    ]
  }
};
```

### For generate-docs.ts

Update `scripts/generate-docs.ts`:

```typescript
const DOCS_CONFIG = {
  'your-example-name': {
    contractPath: './contracts/YourExample.sol',
    testPath: './test/YourExample.ts',
    outputPath: './docs/category/your-example-name.md',
    category: 'category-name',
    complexity: 'advanced',
    estimatedTime: '30-45 minutes'
  }
};
```

---

## Updating Dependencies

### When FHEVM Library Updates

1. **Update base template:**
```bash
cd base-template
npm update @fhevm/solidity @fhevm/hardhat-plugin
```

2. **Test compilation:**
```bash
npm run compile
npm run test
```

3. **Check for breaking changes:**
```bash
# Review @fhevm/solidity changelog
# Update contracts if needed
```

4. **Regenerate all examples:**
```bash
npm run generate-all-docs
```

5. **Test key examples:**
```bash
# Test critical examples
ts-node scripts/create-fhevm-example.ts confidential-supplier-management ./test
cd test && npm install && npm test
```

### Dependency Management

**package.json Structure:**
```json
{
  "dependencies": {
    "@fhevm/solidity": "^0.7.0"  // Use semver
  },
  "devDependencies": {
    "@fhevm/hardhat-plugin": "0.0.1-3",
    "hardhat": "^2.24.3"
  }
}
```

**Pin Critical Versions:**
```bash
npm install @fhevm/solidity@0.7.0 --save
```

---

## Documentation Best Practices

### Contract Comments

```solidity
/**
 * @title Clear, Descriptive Title
 * @notice What users should know before using
 * @dev Technical implementation details
 * @custom:category enterprise
 * @custom:complexity advanced
 */
contract MyContract {
    /**
     * @dev Clear description of what the function does
     * @param paramName Description of the parameter
     * @return Description of return value
     *
     * ## Process
     * 1. Step 1 description
     * 2. Step 2 description
     *
     * ## FHE Patterns
     * - Pattern 1
     * - Pattern 2
     *
     * ## Common Mistakes
     * - Mistake 1: Description
     * - Mistake 2: Description
     */
    function myFunction(uint8 param) external returns (euint8) {
        // Implementation with inline comments
    }
}
```

### README Standards

Every example should include a README with:
- ✅ Overview/Summary
- ✅ Key Features
- ✅ Installation Instructions
- ✅ Compilation & Testing
- ✅ Deployment Steps
- ✅ File Structure
- ✅ FHE Patterns Used
- ✅ Common Pitfalls
- ✅ Resources

### Documentation Generation

Docs are auto-generated using:
1. JSDoc comments from contracts
2. Test case names from test files
3. Metadata from registration

Customization in `scripts/generate-docs.ts`:
```typescript
const DOCS_CONFIG = {
  'example-name': {
    // ... configuration
  }
};
```

---

## Testing Standards

### Test Structure

```typescript
describe("ContractName", function () {
  // Setup
  beforeEach(async function () {
    // Initialize contract
  });

  describe("Feature Group", function () {
    it("✅ CORRECT: Should demonstrate proper usage", async function () {
      // Proper FHE usage
      expect(result).to.equal(expectedValue);
    });

    it("❌ INCORRECT: Should handle errors", async function () {
      // Error case
      await expect(contract.badFunction()).to.be.revertedWith("Error message");
    });
  });

  describe("Edge Cases", function () {
    // Edge case tests
  });

  describe("Access Control", function () {
    // Permission tests
  });
});
```

### Coverage Requirements

- ✅ All public functions
- ✅ Success and failure paths
- ✅ Access control
- ✅ Edge cases
- ✅ FHE permissions
- ✅ Event emission

### Running Tests

```bash
# Single file
npm run test -- test/MyExample.ts

# All tests
npm run test

# With coverage
npm run test:coverage

# Watch mode
npx hardhat test --watch
```

---

## Deployment Procedures

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Code coverage > 80%
- [ ] No compiler warnings
- [ ] Comments complete
- [ ] Documentation generated
- [ ] Environment variables set
- [ ] Gas limits checked

### Deployment Process

1. **Compile:**
```bash
npm run compile
```

2. **Run tests:**
```bash
npm run test
```

3. **Set environment:**
```bash
export PRIVATE_KEY=your_key
export SEPOLIA_RPC_URL=your_rpc
```

4. **Deploy:**
```bash
npm run deploy:sepolia
```

5. **Verify:**
```bash
# Check transaction on block explorer
# Verify contract if needed
```

### Network Configuration

Update `hardhat.config.ts`:
```typescript
networks: {
  sepolia: {
    url: process.env.SEPOLIA_RPC_URL,
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
  },
  zama: {
    url: process.env.ZAMA_RPC_URL,
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
  }
}
```

---

## Troubleshooting

### Common Issues

**Issue: "Cannot find module @fhevm/solidity"**
```bash
# Solution: Install dependencies
npm install
```

**Issue: Compilation errors with euint8**
```bash
# Check Solidity version
# Update imports from correct FHEVM path
import { euint8 } from "@fhevm/solidity/lib/FHE.sol";
```

**Issue: Tests failing with permission errors**
```solidity
// Ensure both permissions are granted
FHE.allowThis(encryptedValue);           // ✅ Contract
FHE.allow(encryptedValue, msg.sender);   // ✅ User
```

**Issue: Hardhat network timeout**
```bash
# Increase timeout in hardhat.config.ts
mocha: {
  timeout: 120000  // 2 minutes
}
```

### Debug Mode

```bash
# Run tests with logging
HARDHAT_LOG=debug npm run test

# Verbose output
npx hardhat test --verbose
```

---

## Contributing Guidelines

### Before Submitting

1. **Code Quality**
   - [ ] Follows project style
   - [ ] No unused variables
   - [ ] Clear naming conventions
   - [ ] Comprehensive comments

2. **Documentation**
   - [ ] JSDoc comments
   - [ ] README updated
   - [ ] Examples provided
   - [ ] Pitfalls documented

3. **Testing**
   - [ ] Tests pass
   - [ ] Coverage > 80%
   - [ ] Edge cases covered
   - [ ] Access control tested

4. **Automation**
   - [ ] Registered in scripts
   - [ ] Metadata added
   - [ ] Documentation generated
   - [ ] Scaffolding tested

### Pull Request Process

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-example`
3. Make changes and test thoroughly
4. Update documentation
5. Commit with clear messages
6. Push and create Pull Request
7. Address review feedback

### Commit Messages

```
format: <type>: <description>

<body>

Fixes #<issue-number>
```

Types: feat, fix, docs, style, refactor, test

---

## Example: Complete Workflow

### Creating "Private Vote Counter"

1. **Create contract:**
```bash
cat > contracts/PrivateVoteCounter.sol << 'EOF'
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;
// ... implementation
EOF
```

2. **Create tests:**
```bash
cat > test/PrivateVoteCounter.ts << 'EOF'
// Test implementation
EOF
```

3. **Register example:**
Edit `scripts/create-fhevm-example.ts` and add to `EXAMPLES_MAP`

4. **Generate documentation:**
```bash
ts-node scripts/generate-docs.ts private-vote-counter
```

5. **Test scaffolding:**
```bash
ts-node scripts/create-fhevm-example.ts private-vote-counter ./test-output
cd test-output && npm install && npm test
```

6. **Generate category:**
```bash
# Update CATEGORIES in create-fhevm-category.ts
ts-node scripts/create-fhevm-category.ts enterprise ./category-output
```

---

## Resources

### Official Documentation
- [FHEVM Docs](https://docs.zama.ai/fhevm)
- [Hardhat Docs](https://hardhat.org/)
- [Solidity Docs](https://docs.soliditylang.org/)

### Community
- [Zama Community Forum](https://www.zama.ai/community)
- [Zama Discord](https://discord.com/invite/zama)
- [GitHub Issues](https://github.com/zama-ai)

### Related Projects
- [FHEVM Repository](https://github.com/zama-ai/fhevm)
- [Hardhat Template](https://github.com/zama-ai/fhevm-hardhat-template)
- [OpenZeppelin Confidential](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts)

---

## Support

For questions or issues:
1. Check this guide and troubleshooting section
2. Review existing examples
3. Check FHEVM documentation
4. Ask in Zama Community Forum
5. File an issue on GitHub

---

**Last Updated**: December 2025
**Version**: 1.0.0

---

*Happy developing! 🚀*
