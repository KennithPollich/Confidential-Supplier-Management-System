# Security Policy

## Overview

Security is a top priority for the FHEVM Example Hub. This document outlines our security practices, how to report vulnerabilities, and security considerations when working with Fully Homomorphic Encryption (FHE) in smart contracts.

---

## Table of Contents

1. [Reporting Security Vulnerabilities](#reporting-security-vulnerabilities)
2. [Supported Versions](#supported-versions)
3. [Security Best Practices](#security-best-practices)
4. [FHE-Specific Security Considerations](#fhe-specific-security-considerations)
5. [Smart Contract Security](#smart-contract-security)
6. [Dependency Management](#dependency-management)
7. [Audit Status](#audit-status)

---

## Reporting Security Vulnerabilities

If you discover a security vulnerability in this project, please report it responsibly.

### How to Report

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please:

1. **Email**: Send details to the project maintainers (contact information in project README)
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)
3. **Response Time**: We aim to respond within 48 hours
4. **Disclosure**: We'll work with you on responsible disclosure timing

### What to Expect

1. **Acknowledgment**: We'll confirm receipt of your report
2. **Investigation**: We'll investigate and validate the issue
3. **Fix**: We'll develop and test a fix
4. **Disclosure**: We'll coordinate public disclosure with you
5. **Credit**: We'll credit you in the security advisory (if desired)

---

## Supported Versions

| Version | Supported          | Status           |
| ------- | ------------------ | ---------------- |
| 1.0.x   | :white_check_mark: | Current release  |
| < 1.0   | :x:                | Pre-release      |

---

## Security Best Practices

### For Developers Using These Examples

#### 1. Private Key Management

```bash
# ✅ CORRECT: Use environment variables
PRIVATE_KEY=your_key_here npm run deploy

# ❌ WRONG: Never hardcode private keys
const PRIVATE_KEY = "0x1234..."; // NEVER DO THIS!
```

**Best Practices**:
- Store private keys in `.env` (never commit to git)
- Use hardware wallets for production deployments
- Rotate keys regularly
- Use separate keys for testnet and mainnet
- Consider using key management services (AWS KMS, Google Cloud KMS)

#### 2. Environment Variables

```bash
# Always use .env.example as template
cp .env.example .env

# Ensure .env is in .gitignore
echo ".env" >> .gitignore
```

#### 3. RPC Endpoint Security

```typescript
// ✅ CORRECT: Use environment variables
const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

// ❌ WRONG: Never expose API keys in code
const provider = new ethers.providers.JsonRpcProvider(
  "https://sepolia.infura.io/v3/YOUR_API_KEY" // NEVER DO THIS!
);
```

#### 4. Dependency Security

```bash
# Regularly audit dependencies
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Check for outdated packages
npm outdated
```

---

## FHE-Specific Security Considerations

### 1. Permission Management

FHE operations require careful permission management to prevent unauthorized access to encrypted data.

```solidity
// ✅ CORRECT: Always grant both permissions
euint32 encrypted = FHE.asEuint32(value);
FHE.allowThis(encrypted);  // Contract permission
FHE.allow(encrypted, msg.sender);  // User permission

// ❌ WRONG: Missing contract permission
euint32 encrypted = FHE.asEuint32(value);
FHE.allow(encrypted, msg.sender);  // Will fail in operations!
```

**Security Impact**: Missing `allowThis` will cause transaction failures when the contract tries to operate on encrypted values.

### 2. Input Validation

```solidity
// ✅ CORRECT: Validate inputs before encryption
function updateRating(bytes32 externalValue) external {
    require(msg.sender == owner, "Unauthorized");
    euint8 newRating = FHE.fromExternal(externalValue);
    // Additional validation logic
    rating = newRating;
}

// ❌ WRONG: No validation
function updateRating(bytes32 externalValue) external {
    rating = FHE.fromExternal(externalValue);  // Anyone can update!
}
```

### 3. Decryption Authorization

```solidity
// ✅ CORRECT: Restrict decryption to authorized users
function requestDecryption() external {
    require(msg.sender == owner, "Only owner can decrypt");
    bytes32[] memory cts = new bytes32[](1);
    cts[0] = FHE.toBytes32(encryptedValue);
    FHE.requestDecryption(cts, this.handleDecryption.selector);
}

// ❌ WRONG: Public decryption
function requestDecryption() external {
    // Anyone can trigger decryption!
    FHE.requestDecryption(cts, this.handleDecryption.selector);
}
```

**Security Impact**: Unauthorized decryption exposes sensitive encrypted data.

### 4. Callback Function Security

```solidity
// ✅ CORRECT: Protect callback functions
function handleDecryption(uint256 requestId, uint32 decryptedValue) public {
    require(msg.sender == address(gateway), "Only gateway");
    // Process decrypted value
}

// ❌ WRONG: Public callback without protection
function handleDecryption(uint256 requestId, uint32 decryptedValue) public {
    // Anyone can call this and inject values!
}
```

### 5. Encrypted Comparison Security

```solidity
// ✅ CORRECT: Comparison results are also encrypted
function compareRatings(uint256 id1, uint256 id2) external view returns (ebool) {
    euint8 rating1 = suppliers[id1].encryptedRating;
    euint8 rating2 = suppliers[id2].encryptedRating;
    return FHE.gt(rating1, rating2);  // Returns encrypted boolean
}

// ❌ WRONG: Trying to use encrypted bool directly
function compareRatings(uint256 id1, uint256 id2) external view returns (bool) {
    ebool result = FHE.gt(rating1, rating2);
    return result;  // Type error - cannot return encrypted bool as bool
}
```

---

## Smart Contract Security

### 1. Access Control

```solidity
// ✅ CORRECT: Implement proper access control
modifier onlyOwner() {
    require(msg.sender == owner, "Only owner");
    _;
}

function criticalFunction() external onlyOwner {
    // Protected function
}
```

### 2. Reentrancy Protection

```solidity
// ✅ CORRECT: Use ReentrancyGuard for state-changing functions
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SecureContract is ReentrancyGuard {
    function withdraw() external nonReentrant {
        // Protected from reentrancy
    }
}
```

### 3. Integer Overflow/Underflow

Solidity 0.8.x has built-in overflow protection, but be aware when using `unchecked` blocks:

```solidity
// ✅ CORRECT: Automatic overflow protection
uint256 a = type(uint256).max;
uint256 b = a + 1;  // Will revert automatically

// ⚠️ CAUTION: Unchecked blocks disable protection
unchecked {
    uint256 c = a + 1;  // Will overflow without reverting
}
```

### 4. Gas Optimization vs Security

```solidity
// ✅ BALANCED: Optimize but maintain security
function processMultiple(uint256[] calldata ids) external {
    require(ids.length <= 100, "Too many items");  // Prevent DoS
    for (uint256 i = 0; i < ids.length; i++) {
        // Process items
    }
}
```

---

## Dependency Management

### Current Dependencies

- `@fhevm/solidity`: ^0.7.0 - Core FHE operations
- `hardhat`: ^2.24.3 - Development framework
- `@openzeppelin/contracts`: Latest stable - Security utilities

### Security Practices

1. **Pin Dependencies**: Use exact versions in production
   ```json
   {
     "dependencies": {
       "@fhevm/solidity": "0.7.0"  // Exact version
     }
   }
   ```

2. **Regular Updates**: Check for security updates weekly
   ```bash
   npm update
   npm audit
   ```

3. **Dependency Audits**: Run before each deployment
   ```bash
   npm audit --audit-level=high
   ```

4. **Lock Files**: Commit `package-lock.json` to ensure reproducible builds

---

## Audit Status

### Current Status

This project is an **educational example repository** demonstrating FHE patterns. It has not undergone formal security audits.

**Recommendations for Production Use**:

1. **Conduct Professional Audit**: Engage security firms specializing in:
   - Smart contract audits
   - FHE implementation review
   - Zama FHEVM expertise

2. **Recommended Audit Firms**:
   - Trail of Bits
   - ConsenSys Diligence
   - OpenZeppelin Security
   - Quantstamp

3. **Internal Reviews**:
   - Peer code review for all changes
   - Security checklist before deployment
   - Test coverage >95%

### Testing

```bash
# Run security-focused tests
npm run test

# Generate coverage report
npm run test:coverage

# Run Slither static analysis
pip3 install slither-analyzer
slither .
```

---

## Security Checklist for Deployment

Before deploying to production:

- [ ] All tests passing with >95% coverage
- [ ] Security audit completed and issues resolved
- [ ] Dependencies audited (`npm audit` clean)
- [ ] Private keys secured (hardware wallet or KMS)
- [ ] Access control verified
- [ ] FHE permissions correctly implemented
- [ ] Callback functions protected
- [ ] Input validation in place
- [ ] Gas limits tested
- [ ] Emergency pause mechanism (if needed)
- [ ] Monitoring and alerting configured
- [ ] Incident response plan documented

---

## Known Limitations

1. **FHE Gas Costs**: FHE operations consume significantly more gas than standard operations
2. **Async Decryption**: Decryption requires callback patterns and additional transactions
3. **Type Limitations**: FHE supports limited integer types (euint8, euint16, euint32, euint64)
4. **Performance**: Encrypted operations are slower than plaintext operations

---

## Security Resources

### FHEVM Security

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Security Best Practices](https://docs.zama.ai/fhevm/security)
- [FHE Permission Model](https://docs.zama.ai/fhevm/fundamentals/permissions)

### General Smart Contract Security

- [ConsenSys Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [OWASP Smart Contract Top 10](https://owasp.org/www-project-smart-contract-top-10/)
- [SWC Registry](https://swcregistry.io/)

### Tools

- [Slither](https://github.com/crytic/slither) - Static analysis
- [Mythril](https://github.com/ConsenSys/mythril) - Security analysis
- [Hardhat](https://hardhat.org/) - Development framework with security features

---

## Contact

For security concerns, please contact the project maintainers through the channels specified in the main README.

---

**Last Updated**: December 2025

**Disclaimer**: This security policy applies to the example code repository. Always conduct independent security reviews before using any code in production environments.
