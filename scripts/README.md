# Automation Scripts Documentation

This directory contains TypeScript-based automation tools for generating FHEVM example repositories, categories, and documentation.

---

## Scripts Overview

### 1. create-fhevm-example.ts

Generates **standalone FHEVM example repositories** from the base template.

#### Usage

```bash
ts-node scripts/create-fhevm-example.ts <example-name> [output-path]
```

#### Examples

```bash
# Generate single example
ts-node scripts/create-fhevm-example.ts confidential-supplier-management ./examples/supplier-mgmt

# Generate basic counter example
ts-node scripts/create-fhevm-example.ts fhe-counter ./examples/counter

# List all available examples
ts-node scripts/create-fhevm-example.ts
```

#### What It Does

1. **Validates** example exists in registry
2. **Creates** output directory
3. **Copies** base template to output
4. **Inserts** example contract file
5. **Copies** test files
6. **Updates** package.json with example metadata
7. **Generates** README.md
8. **Creates** metadata file (.fhevm-example.json)

#### Generated Structure

```
<example-name>/
├── contracts/
│   └── YourExample.sol
├── test/
│   └── YourExample.ts
├── scripts/
│   ├── deploy.ts
│   └── helpers.ts
├── hardhat.config.ts
├── package.json
├── tsconfig.json
├── README.md
├── .env.example
└── .fhevm-example.json
```

#### Output Files

**package.json** - Updated with:
- Example name
- Description
- Keywords
- FHE example metadata

**README.md** - Contains:
- Overview
- Key features
- Quick start instructions
- File structure
- Resources

**.fhevm-example.json** - Metadata:
- Example ID
- Category and complexity
- Contract and test files
- Documentation links

---

### 2. create-fhevm-category.ts

Generates **category-based FHEVM example collections** with multiple examples.

#### Usage

```bash
ts-node scripts/create-fhevm-category.ts <category> [output-path]
```

#### Examples

```bash
# Generate enterprise category
ts-node scripts/create-fhevm-category.ts enterprise ./examples/enterprise

# Generate basic examples
ts-node scripts/create-fhevm-category.ts basic ./examples/basic

# List available categories
ts-node scripts/create-fhevm-category.ts
```

#### What It Does

1. **Validates** category exists
2. **Creates** output directory
3. **Copies** base template
4. **Collects** all examples in category
5. **Copies** all contracts and tests
6. **Generates** unified README.md
7. **Creates** unified deploy script
8. **Writes** category metadata

#### Generated Structure

```
<category>-examples/
├── contracts/
│   ├── Example1.sol
│   ├── Example2.sol
│   └── Example3.sol
├── test/
│   ├── Example1.ts
│   ├── Example2.ts
│   └── Example3.ts
├── scripts/
│   ├── deploy.ts
│   └── helpers.ts
├── hardhat.config.ts
├── package.json
├── tsconfig.json
├── README.md
├── .env.example
└── .fhevm-category.json
```

#### Unified Deployment

The generated `scripts/deploy.ts` deploys all examples in the category:

```typescript
// Deploys Example1, Example2, Example3
const deployedContracts = {
  "Example1": "0x...",
  "Example2": "0x...",
  "Example3": "0x..."
};
```

#### Category README

Includes:
- Category overview
- All included examples
- Key topics covered
- Installation and testing
- Learning path

---

### 3. generate-docs.ts

Generates **GitBook-compatible documentation** from contracts and tests.

#### Usage

```bash
ts-node scripts/generate-docs.ts <example-name>
ts-node scripts/generate-docs.ts --all
```

#### Examples

```bash
# Generate documentation for one example
ts-node scripts/generate-docs.ts confidential-supplier-management

# Generate all documentation
ts-node scripts/generate-docs.ts --all

# Generate with custom output directory
ts-node scripts/generate-docs.ts fhe-counter ./my-docs
```

#### What It Does

1. **Extracts** contract comments and code
2. **Analyzes** test cases
3. **Creates** markdown documentation
4. **Includes** FHE patterns and examples
5. **Documents** test coverage
6. **Generates** SUMMARY.md for GitBook

#### Generated Documentation

For each example, creates:
- **Overview** section
- **Key Features** list
- **Learning Outcomes**
- **Architecture** explanation
- **Code Examples**
- **Test Cases** list
- **How It Works** guide
- **Running** instructions
- **FHE Patterns** reference
- **Common Pitfalls** section
- **Resources** links

#### Generated Files

**example-name.md**:
```markdown
# Example Name

**Category**: ...
**Complexity**: advanced
**Estimated Time**: 30-45 minutes

## Overview
...

## Key Features
...

[Complete documentation]
```

**SUMMARY.md**:
```markdown
# Summary

## Getting Started
* [Introduction](README.md)

## Enterprise Applications
* [Confidential Supplier Management](enterprise/confidential-supplier-management.md)

## Basic Examples
* [FHE Counter](basic/fhe-counter.md)
```

---

## Automation Flow

### Creating a Single Example

```
Developer
    ↓
create-fhevm-example.ts
    ↓
1. Register in EXAMPLES_MAP
2. Place contract in contracts/
3. Place test in test/
    ↓
ts-node scripts/create-fhevm-example.ts example-name ./output
    ↓
Standalone repository created
    ↓
npm install
npm run test
npm run deploy:sepolia
```

### Creating a Category

```
Developer
    ↓
1. Create multiple examples
2. Register in EXAMPLES_MAP
3. Add to CATEGORIES
    ↓
ts-node scripts/create-fhevm-category.ts category ./output
    ↓
Category repository with all examples
    ↓
npm install
npm run test  (all tests)
npm run deploy:sepolia
```

### Generating Documentation

```
Developer
    ↓
1. Write contracts with JSDoc
2. Write tests with descriptions
3. Register in DOCS_CONFIG
    ↓
ts-node scripts/generate-docs.ts example-name
    ↓
Markdown documentation generated
    ↓
SUMMARY.md created
    ↓
Push to GitBook
```

---

## Configuration

### Adding a New Example

**Step 1: Create contract and test**
```bash
cp contracts/Example.sol [new]
cp test/Example.ts [new]
```

**Step 2: Register in create-fhevm-example.ts**
```typescript
const EXAMPLES_MAP = {
  'your-example': {
    name: 'Your Example',
    description: '...',
    category: 'enterprise',
    contractFile: 'YourExample.sol',
    testFile: 'YourExample.ts',
    complexity: 'advanced',
    keywords: [...],
    documentation: { ... }
  }
};
```

**Step 3: Register in create-fhevm-category.ts**
```typescript
const CATEGORIES = {
  enterprise: {
    examples: [
      'confidential-supplier-management',
      'your-example'  // Add here
    ]
  }
};
```

**Step 4: Configure documentation**
```typescript
const DOCS_CONFIG = {
  'your-example': {
    contractPath: './contracts/YourExample.sol',
    testPath: './test/YourExample.ts',
    outputPath: './docs/enterprise/your-example.md',
    category: 'enterprise',
    complexity: 'advanced'
  }
};
```

### Adding a New Category

**Step 1: Update create-fhevm-category.ts**
```typescript
const CATEGORIES = {
  'your-category': {
    name: 'Your Category Name',
    description: 'Description',
    examples: ['example1', 'example2'],
    keyTopics: ['Topic 1', 'Topic 2']
  }
};
```

**Step 2: Generate category**
```bash
ts-node scripts/create-fhevm-category.ts your-category ./output
```

---

## Running All Scripts

### Development Workflow

```bash
# 1. Add new example
# - Create contracts/NewExample.sol
# - Create test/NewExample.ts
# - Register in scripts

# 2. Test compilation
npm run compile

# 3. Run tests
npm run test

# 4. Generate documentation
ts-node scripts/generate-docs.ts new-example

# 5. Create standalone example
ts-node scripts/create-fhevm-example.ts new-example ./test-output
cd test-output
npm install && npm run test

# 6. Create category
ts-node scripts/create-fhevm-category.ts category ./category-output
cd category-output
npm install && npm run test
```

### Batch Operations

**Generate all documentation:**
```bash
ts-node scripts/generate-docs.ts --all
```

**Generate multiple examples:**
```bash
for example in confidential-supplier-management fhe-counter; do
  ts-node scripts/create-fhevm-example.ts $example ./examples/$example
  cd examples/$example && npm install && npm test && cd ../..
done
```

---

## Troubleshooting

### Script Errors

**"Example not found"**
- Check example is registered in EXAMPLES_MAP
- Verify contract and test files exist

**"Category not found"**
- Check category is registered in CATEGORIES
- Verify examples exist in category

**"Cannot find module"**
- Run `npm install` first
- Check TypeScript configuration

### Generated Repository Issues

**Compilation errors after generation**
- Check base template compiles: `cd base-template && npm run compile`
- Verify contract syntax
- Check FHEVM imports

**Tests fail in generated repo**
- Run tests with verbose flag: `npm run test -- --verbose`
- Check environment variables
- Review test file syntax

**Deployment fails**
- Set environment variables: `export PRIVATE_KEY=...`
- Check network configuration
- Verify gas limits

---

## Best Practices

### Creating Examples

1. ✅ Write clear JSDoc comments
2. ✅ Include comprehensive tests
3. ✅ Document FHE patterns used
4. ✅ Test error cases
5. ✅ Verify scaffolding works

### Maintaining Scripts

1. ✅ Keep example registry updated
2. ✅ Update documentation config
3. ✅ Test on multiple Node versions
4. ✅ Validate generated output
5. ✅ Keep dependencies updated

### Documentation

1. ✅ Use consistent formatting
2. ✅ Include code examples
3. ✅ Document patterns
4. ✅ List resources
5. ✅ Update regularly

---

## Support

For issues with automation scripts:
1. Review this README
2. Check script source code
3. Examine generated output
4. Enable verbose logging
5. Ask in Zama Community

---

**Version**: 1.0.0
**Last Updated**: December 2025

---

*Built for the Zama FHEVM Bounty Program*
