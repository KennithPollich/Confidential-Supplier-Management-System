# Contributing to FHEVM Example Hub

Thank you for your interest in contributing to the FHEVM Example Hub! This document provides guidelines for contributing new examples, improvements, and documentation.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [How to Contribute](#how-to-contribute)
3. [Adding New Examples](#adding-new-examples)
4. [Code Standards](#code-standards)
5. [Testing Requirements](#testing-requirements)
6. [Documentation Guidelines](#documentation-guidelines)
7. [Pull Request Process](#pull-request-process)
8. [Community Guidelines](#community-guidelines)

---

## Getting Started

### Prerequisites

- Node.js >= 14.0.0
- npm or yarn
- Git
- Basic understanding of Solidity and FHE concepts
- Familiarity with Hardhat

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd SupplierManagement

# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm run test
```

---

## How to Contribute

We welcome contributions in the following areas:

### 1. New Examples
- Additional FHE patterns and use cases
- Real-world business scenarios
- Educational demonstrations
- Advanced FHE operations

### 2. Documentation
- Improved explanations
- Additional code examples
- Tutorial content
- Translation (if applicable)

### 3. Testing
- Additional test cases
- Edge case coverage
- Performance tests
- Integration tests

### 4. Tooling
- Automation script improvements
- Documentation generators
- CI/CD enhancements
- Development tools

---

## Adding New Examples

### Step-by-Step Process

#### 1. Create the Contract

Create your Solidity contract in `contracts/YourExample.sol`:

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title Your Example Name
 * @notice Brief description
 * @dev Detailed explanation of FHE concepts demonstrated
 *
 * ## Overview
 * Explain what this example does and why it's useful
 *
 * ## Key Concepts
 * - Concept 1
 * - Concept 2
 */
contract YourExample is SepoliaConfig {
    // Implementation with detailed comments
}
```

**Requirements**:
- ✅ BSD-3-Clause-Clear license header
- ✅ Comprehensive JSDoc comments
- ✅ Clear function documentation
- ✅ FHE pattern explanations
- ✅ Input validation
- ✅ Event logging

#### 2. Create Tests

Create test file in `test/YourExample.ts`:

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";

/**
 * Test Suite: Your Example
 * Category: [basic|enterprise|advanced]
 * Chapter: [relevant-topics]
 */
describe("YourExample", function () {
  // Setup
  beforeEach(async function () {
    // Initialize contract
  });

  describe("Feature Group", function () {
    it("✅ CORRECT: Should demonstrate proper usage", async function () {
      // Test correct behavior
    });

    it("❌ INCORRECT: Should handle errors", async function () {
      // Test error handling
    });
  });
});
```

**Requirements**:
- ✅ Use ✅/❌ markers for correct/incorrect patterns
- ✅ Test both success and failure cases
- ✅ Cover edge cases
- ✅ Verify access control
- ✅ Test FHE operations
- ✅ Achieve >90% code coverage

#### 3. Register the Example

Add to `examples-registry.json`:

```json
"your-example": {
  "id": "your-example",
  "name": "Your Example Name",
  "description": "Brief description",
  "category": "basic|enterprise|advanced",
  "complexity": "beginner|intermediate|advanced",
  "estimatedTime": "15-20 minutes",
  "status": "production-ready",
  "concepts": ["concept1", "concept2"],
  "patterns": ["FHE.pattern1", "FHE.pattern2"],
  "files": {
    "contract": "contracts/YourExample.sol",
    "test": "test/YourExample.ts"
  }
}
```

#### 4. Update Automation Scripts

In `scripts/create-fhevm-example.ts`, add to `EXAMPLES_MAP`:

```typescript
'your-example': {
  name: 'Your Example Name',
  description: 'Description',
  category: 'category-name',
  contractFile: 'YourExample.sol',
  testFile: 'YourExample.ts',
  complexity: 'advanced',
  keywords: ['keyword1', 'keyword2'],
  documentation: {
    overview: 'Overview text',
    keyFeatures: ['Feature 1', 'Feature 2'],
    learningOutcomes: ['Outcome 1', 'Outcome 2']
  }
}
```

#### 5. Generate Documentation

```bash
ts-node scripts/generate-docs.ts your-example
```

#### 6. Test the Example

```bash
# Compile
npm run compile

# Run tests
npm run test -- test/YourExample.ts

# Test scaffolding
ts-node scripts/create-fhevm-example.ts your-example ./test-output
cd test-output && npm install && npm test
```

---

## Code Standards

### Solidity Guidelines

**Naming Conventions**:
- Contracts: PascalCase (e.g., `FHECounter`)
- Functions: camelCase (e.g., `getCount`)
- Variables: camelCase with leading underscore for private (e.g., `_count`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_VALUE`)

**Code Style**:
- Use 4 spaces for indentation
- Include comprehensive comments
- Document all FHE operations
- Validate all inputs
- Emit events for state changes
- Follow Solidity best practices

**FHE Best Practices**:
```solidity
// ✅ CORRECT: Always grant both permissions
euint32 encrypted = FHE.asEuint32(value);
FHE.allowThis(encrypted);
FHE.allow(encrypted, msg.sender);

// ❌ WRONG: Missing allowThis
euint32 encrypted = FHE.asEuint32(value);
FHE.allow(encrypted, msg.sender); // Will fail!
```

### TypeScript Guidelines

**Testing Style**:
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Include both positive and negative tests
- Test edge cases
- Use ✅/❌ markers in test descriptions

**Code Organization**:
- Group related tests in `describe` blocks
- Use `beforeEach` for setup
- Keep tests focused and independent
- Document complex test logic

---

## Testing Requirements

### Minimum Coverage

- **Statements**: >90%
- **Branches**: >85%
- **Functions**: 100%
- **Lines**: >90%

### Test Categories

1. **Unit Tests**: Test individual functions
2. **Integration Tests**: Test function interactions
3. **Edge Cases**: Test boundary conditions
4. **Access Control**: Test authorization
5. **FHE Operations**: Test encryption/decryption
6. **Error Handling**: Test failure modes

### Running Tests

```bash
# All tests
npm run test

# Specific file
npm run test -- test/YourExample.ts

# With coverage
npm run test:coverage

# Watch mode
npx hardhat test --watch
```

---

## Documentation Guidelines

### Contract Documentation

Use JSDoc format:

```solidity
/**
 * @dev Function description
 * @param paramName Description of parameter
 * @return Description of return value
 *
 * ## Pattern Name
 * Explanation of FHE pattern used
 *
 * ## Common Mistakes
 * - Mistake 1: Explanation
 * - Mistake 2: Explanation
 */
function exampleFunction(uint256 paramName) external returns (uint256) {
    // Implementation
}
```

### README Updates

When adding examples, update:
- Main README.md with example listing
- Base template README if templates change
- scripts/README.md if automation changes

### Generated Documentation

Documentation is auto-generated from:
- Contract JSDoc comments
- Test case descriptions
- Example registry metadata

Ensure all source code is well-commented for quality generation.

---

## Pull Request Process

### Before Submitting

- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] Code coverage meets requirements
- [ ] Documentation updated
- [ ] Example registered in automation
- [ ] No console.log or debug code
- [ ] Code follows style guidelines
- [ ] Commit messages are clear

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New example
- [ ] Bug fix
- [ ] Documentation update
- [ ] Automation improvement

## Checklist
- [ ] Code compiles
- [ ] Tests pass (>90% coverage)
- [ ] Documentation updated
- [ ] Example registered
- [ ] Follows style guide

## Related Issues
Fixes #(issue number)

## Testing
Describe how you tested the changes

## Screenshots (if applicable)
```

### Review Process

1. **Automated Checks**: CI/CD must pass
2. **Code Review**: At least one approval required
3. **Testing**: Reviewers verify functionality
4. **Documentation**: Check completeness
5. **Merge**: Squash and merge to main

---

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on improving the ecosystem
- Help others learn FHE concepts

### Getting Help

- **Questions**: Use GitHub Discussions
- **Bugs**: Create GitHub Issues
- **Security**: Report privately to maintainers
- **General**: Join Zama Community Discord

### Communication

- Use clear, professional language
- Provide context in issues and PRs
- Respond to feedback constructively
- Thank contributors for their time

---

## Example Categories

### Basic Examples
- Simple FHE operations
- Arithmetic demonstrations
- Permission management
- State storage patterns

### Enterprise Examples
- Business use cases
- Privacy-preserving operations
- Access control patterns
- Real-world scenarios

### Advanced Examples
- Complex FHE operations
- Multi-contract interactions
- Gas optimization
- Advanced patterns

---

## Versioning

We use [Semantic Versioning](https://semver.org/):
- **Major**: Breaking changes
- **Minor**: New features (backwards compatible)
- **Patch**: Bug fixes

---

## License

All contributions must be licensed under BSD-3-Clause-Clear.

By contributing, you agree that your contributions will be licensed under the project's BSD-3-Clause-Clear License.

---

## Recognition

Contributors are recognized in:
- GitHub contributors page
- Project documentation
- Release notes (for significant contributions)

---

## Questions?

- Check [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- Review existing examples
- Ask in GitHub Discussions
- Join Zama Community

---

**Thank you for contributing to FHEVM Example Hub!**

Your contributions help developers worldwide learn and implement privacy-preserving smart contracts using Fully Homomorphic Encryption.

---

*Last Updated: December 2025*
