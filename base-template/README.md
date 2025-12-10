# FHEVM Hardhat Template

A complete, production-ready Hardhat template for developing FHEVM (Fully Homomorphic Encryption Virtual Machine) smart contracts.

## Quick Start

### Prerequisites
- Node.js >= 14.0.0
- npm or yarn
- A text editor or IDE

### Installation

```bash
npm install
```

### Compilation

```bash
npm run compile
```

### Testing

```bash
npm run test
```

### Deployment

```bash
# Set environment variables
export PRIVATE_KEY=your_private_key
export SEPOLIA_RPC_URL=your_rpc_url

# Deploy to Sepolia testnet
npm run deploy:sepolia

# Deploy to Zama testnet
npm run deploy:zama
```

## Project Structure

```
├── contracts/          # Solidity smart contracts
├── test/              # Test files (TypeScript/JavaScript)
├── scripts/           # Deployment and utility scripts
├── hardhat.config.ts  # Hardhat configuration
├── tsconfig.json      # TypeScript configuration
├── package.json       # Dependencies
└── README.md          # This file
```

## Features

- ✅ FHEVM support via `@fhevm/hardhat-plugin`
- ✅ TypeScript support
- ✅ Hardhat testing framework
- ✅ Multiple network support (Sepolia, Zama, Localhost)
- ✅ Gas reporting
- ✅ Contract verification
- ✅ Type-safe contract interactions via TypeChain

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Network RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
ZAMA_RPC_URL=https://devnet.zama.ai

# Private key for deployments (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Etherscan API key for verification
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Networks

The template includes pre-configured networks:
- **sepolia**: Ethereum Sepolia testnet (11155111)
- **zama**: Zama testnet (8009)
- **localhost**: Local hardhat network

## Available Scripts

```bash
# Compile contracts
npm run compile

# Run tests
npm run test

# Generate test coverage report
npm run test:coverage

# Deploy to default network
npm run deploy

# Deploy to Sepolia
npm run deploy:sepolia

# Deploy to Zama
npm run deploy:zama

# Lint Solidity files
npm run lint

# Format Solidity files
npm run format

# Clean build artifacts
npm run clean

# Generate TypeChain types
npm run typechain
```

## Writing Contracts

All contracts should inherit from the appropriate config class:

```solidity
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract MyContract is SepoliaConfig {
    // Your implementation
}
```

## Writing Tests

Tests use Hardhat's testing framework with Chai assertions:

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyContract", function () {
  let contract: MyContract;

  beforeEach(async function () {
    const Factory = await ethers.getContractFactory("MyContract");
    contract = await Factory.deploy();
    await contract.deployed();
  });

  it("Should work correctly", async function () {
    expect(await contract.someFunction()).to.equal(expectedValue);
  });
});
```

## FHEVM Best Practices

### 1. Proper Permission Handling
```solidity
euint8 encryptedValue = FHE.asEuint8(123);
FHE.allowThis(encryptedValue);              // Contract permission
FHE.allow(encryptedValue, msg.sender);      // User permission
```

### 2. Access Control
```solidity
require(msg.sender == owner, "Only owner");
```

### 3. Encrypted Operations
```solidity
euint8 result = FHE.add(encryptedA, encryptedB);
```

### 4. Async Decryption
```solidity
FHE.requestDecryption(cts, this.callback.selector);
```

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Zama Community](https://www.zama.ai/community)

## License

BSD-3-Clause-Clear

---

Built with ❤️ for the FHEVM ecosystem
