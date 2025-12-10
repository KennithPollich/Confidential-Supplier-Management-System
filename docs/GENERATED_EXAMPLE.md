# Confidential Supplier Management System

**Category**: enterprise
**Complexity**: advanced
**Estimated Time**: 30-45 minutes

## Overview

This example demonstrates a privacy-preserving supplier management system where supplier ratings are encrypted using Fully Homomorphic Encryption. Only authorized parties (suppliers/owners) can decrypt rating information, while the system supports privacy-preserving comparisons and operations without revealing underlying values.

## Key Features

- Encrypted supplier ratings (euint8)
- Privacy-preserving comparisons
- Owner-only decryption access
- Async callback-based decryption
- Proper FHE permission handling
- Comprehensive access control

## Learning Outcomes

- How to encrypt sensitive business data
- Managing permissions for encrypted values
- Implementing access control patterns
- Async decryption workflows
- Real-world enterprise applications of FHE

## Architecture

### Contract Structure

The contract is organized into the following main sections:

1. **State Variables** - Storage for supplier data and encrypted ratings
2. **Supplier Struct** - Data structure for supplier information
3. **Constructor** - Initialization (if needed)
4. **Core Functions** - Main contract functionality
5. **Utility Functions** - Helper methods and queries
6. **Events** - Important events for monitoring

### Key FHE Operations

This example demonstrates:
- Encrypted data types (euint8 for supplier ratings 1-10)
- Permission management (FHE.allowThis(), FHE.allow())
- Privacy-preserving comparisons
- Async decryption callbacks with event emission

## Code Examples

### Adding a Supplier with Encrypted Rating

```typescript
// Client-side: Request to add supplier
const tx = await contract.addSupplier(
  "Electronics Supplier Co",    // name (public)
  "Electronics",                  // category (public)
  "contact@supplier.com",        // contact (public)
  8,                              // rating 1-10 (will be encrypted)
  false                           // initially not preferred
);

// Contract-side (FHE encryption)
// The contract encrypts the rating:
// euint8 encryptedRating = FHE.asEuint8(_rating);
// FHE.allowThis(encryptedRating);
// FHE.allow(encryptedRating, msg.sender);
```

### Updating a Supplier Rating (Owner-Only)

```typescript
// Only owner can update their supplier's rating
const tx = await contract.connect(ownerAccount).updateSupplierRating(
  supplierId,  // which supplier to update
  9            // new rating (1-10)
);

// Non-owner attempt fails:
await expect(
  contract.connect(differentAccount).updateSupplierRating(supplierId, 9)
).to.be.revertedWith("Only owner can update");
```

### Privacy-Preserving Comparison

```typescript
// Compare suppliers without revealing actual ratings
const result = await contract.compareSupplierRatings(supplierId1, supplierId2);
// result: boolean indicating if supplier1 rating >= supplier2 rating
// Actual ratings remain encrypted during comparison
```

### Requesting Decryption (Async Callback)

```typescript
// Owner requests decryption of their supplier's rating
const tx = await contract.requestRatingDecryption(supplierId);

// This triggers async decryption callback:
// function processRatingDecryption(
//   uint256 requestId,
//   uint8 decryptedRating,
//   bytes[] memory signatures
// ) external
```

## Test Cases

**Total Tests**: 35+

Test coverage includes:
- Adding suppliers with encrypted data
- Supplier information retrieval
- Rating updates (owner-only)
- Invalid input validation
- Preference status management
- Privacy-preserving comparisons
- Access control enforcement
- Async decryption requests
- Complex multi-user workflows
- FHE pattern validation
- Edge cases and error conditions

## How It Works

### Step 1: Setup
Initialize the contract and prepare supplier management environment.

### Step 2: Add Supplier
Register a new supplier with encrypted rating:
```solidity
function addSupplier(
    string memory _name,
    string memory _category,
    string memory _contact,
    uint8 _rating,
    bool _isPreferred
) external
```

Internally, the contract:
1. Validates input (rating 1-10, non-empty strings)
2. Encrypts the rating: `euint8 encryptedRating = FHE.asEuint8(_rating);`
3. Grants permissions: `FHE.allowThis()` and `FHE.allow()`
4. Stores supplier with encrypted rating
5. Emits `SupplierAdded` event

### Step 3: Update Encrypted Rating
Only the supplier's owner can update:
```solidity
function updateSupplierRating(uint256 _supplierId, uint8 _newRating) external
```

### Step 4: Perform Operations
Compare or query suppliers:
```solidity
function compareSupplierRatings(uint256 _supplierId1, uint256 _supplierId2)
    external view returns (bool)
```

Comparisons happen on encrypted data without revealing actual ratings.

### Step 5: Request Decryption
Owner can request to decrypt rating:
```solidity
function requestRatingDecryption(uint256 _supplierId) external
```

Decryption happens asynchronously through callback mechanism.

## Running the Example

### Prerequisites
- Node.js >= 14.0.0
- npm or yarn

### Installation
```bash
npm install
```

### Compilation
```bash
npm run compile
```

All contracts should compile without errors or warnings.

### Testing
```bash
npm run test
```

To run tests for this example specifically:
```bash
npx hardhat test test/SupplierManagement.ts
```

To see detailed test output:
```bash
npx hardhat test test/SupplierManagement.ts --verbose
```

### Test Coverage
```bash
npm run test:coverage
```

Target coverage for this example:
- Statements: > 95%
- Branches: > 90%
- Functions: 100%
- Lines: > 95%

### Deployment
```bash
# Deploy to Sepolia testnet
npm run deploy:sepolia

# Deploy to Zama testnet
npm run deploy:zama
```

## FHE Patterns Used

### Pattern 1: Permission Management
```solidity
euint8 encryptedValue = FHE.asEuint8(plainValue);
FHE.allowThis(encryptedValue);              // ✅ Contract permission
FHE.allow(encryptedValue, msg.sender);      // ✅ User permission
```

**Why both permissions?**
- `FHE.allowThis()` - Allows the contract to use the encrypted value
- `FHE.allow()` - Allows the user to decrypt the value
- Both are required for complete functionality

### Pattern 2: Access Control
```solidity
require(msg.sender == suppliers[_supplierId].owner, "Only owner can update");
```

**Security benefit**: Ensures privacy - only data owner can decrypt their own ratings.

### Pattern 3: Encrypted Operations
```solidity
euint8 result = FHE.add(encryptedA, encryptedB);
// Or comparisons:
// FHE.ge, FHE.le, FHE.eq - work on encrypted values
```

**Privacy benefit**: Operations complete without revealing actual values.

### Pattern 4: Async Decryption
```solidity
function requestRatingDecryption(uint256 _supplierId) external {
    bytes32[] memory cts = new bytes32[](1);
    cts[0] = FHE.toBytes32(suppliers[_supplierId].rating);
    FHE.requestDecryption(cts, this.processRatingDecryption.selector);
}

function processRatingDecryption(
    uint256 requestId,
    uint8 decryptedRating,
    bytes[] memory signatures
) external {
    emit RatingDecrypted(msg.sender, decryptedRating);
}
```

**Benefit**: Two-phase decryption ensures security and auditability.

## Common Pitfalls & Solutions

### ❌ Forgetting FHE.allowThis()

```solidity
// WRONG - will fail
euint8 encryptedValue = FHE.asEuint8(value);
FHE.allow(encryptedValue, msg.sender);
// Missing FHE.allowThis()!
```

### ✅ Correct Permission Handling

```solidity
// RIGHT - always include both
euint8 encryptedValue = FHE.asEuint8(value);
FHE.allowThis(encryptedValue);
FHE.allow(encryptedValue, msg.sender);
```

### ❌ Returning Encrypted from View Function

```solidity
// WRONG - view functions can't return encrypted values
function getEncryptedRating() external view returns (euint8) {
    return suppliers[1].rating;
}
```

### ✅ Proper Decryption Request

```solidity
// RIGHT - use async callback
function requestRatingDecryption() external {
    FHE.requestDecryption(cts, this.callback.selector);
}
```

### ❌ Missing Access Control

```solidity
// WRONG - anyone can update
function updateRating(uint256 id, uint8 newRating) external {
    suppliers[id].rating = FHE.asEuint8(newRating);
}
```

### ✅ Proper Access Control

```solidity
// RIGHT - check owner
function updateRating(uint256 id, uint8 newRating) external {
    require(msg.sender == suppliers[id].owner, "Only owner");
    suppliers[id].rating = FHE.asEuint8(newRating);
    FHE.allowThis(suppliers[id].rating);
    FHE.allow(suppliers[id].rating, msg.sender);
}
```

## Advanced Topics

### State Management with Encrypted Values

How encrypted values are stored, updated, and maintained:
- Each supplier has an encrypted rating (euint8)
- Ratings are updated through dedicated functions
- Old encrypted values are replaced with new ones
- Permissions are re-granted on each update

### Multi-Step Operations

Performing complex logic:
1. Retrieve encrypted values
2. Perform computations on encrypted data
3. Update state with results
4. Request decryption if needed

### Decryption Callbacks

The two-phase decryption process:
1. **Request Phase**: `requestRatingDecryption()` initiates async decryption
2. **Callback Phase**: `processRatingDecryption()` receives decrypted value
3. **Event Phase**: Emit event with decrypted value for off-chain notification

## Real-World Applications

### Use Case 1: Procurement Decisions
Buyers evaluate suppliers based on encrypted ratings without revealing scores to competitors.

### Use Case 2: Vendor Compliance
Verify supplier reliability through private ratings while maintaining competitive confidentiality.

### Use Case 3: Supply Chain Privacy
Protect supplier performance data while enabling data-driven decision making.

### Use Case 4: Competitive Intelligence
Compare suppliers without exposing individual ratings to external parties.

## Performance Considerations

### Gas Optimization
- Batch operations where possible
- Minimize encrypted operations
- Use uint8 for ratings (smaller data = lower gas)

### Scalability
- Consider mapping for large numbers of suppliers
- Use events for off-chain indexing
- Batch decryption requests

## Security Considerations

### Access Control
- ✅ Owner-only rating updates
- ✅ Owner-only decryption access
- ✅ Owner-only preference updates
- ✅ Proper error messages

### Data Integrity
- ✅ Input validation (rating ranges)
- ✅ Supplier existence checks
- ✅ ID validation
- ✅ Type safety (euint8 for ratings)

### Privacy
- ✅ Encrypted storage
- ✅ Async decryption
- ✅ Access-controlled operations
- ✅ No plaintext logging

## Resources

### Official Documentation
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)

### Community Support
- [Zama Community Forum](https://www.zama.ai/community)
- [Zama Discord Server](https://discord.com/invite/zama)
- [Zama GitHub](https://github.com/zama-ai)

### Related Examples
- FHE Counter (Basic encryption operations)
- Private Voting (Access control patterns)
- Confidential Auction (Complex FHE operations)

## Next Steps

### After Completing This Example

1. ✅ Study the contract code thoroughly
2. ✅ Run and modify the tests
3. ✅ Deploy to testnet
4. ✅ Interact with deployed contract
5. ✅ Create similar examples
6. ✅ Build production applications

### Learn More

- Review FHEVM documentation
- Study other enterprise examples
- Participate in Zama community
- Build your own FHE application

## Questions & Support

### Getting Help

1. **Check the code comments** - Detailed explanations in contracts/tests
2. **Review test cases** - See all usage patterns
3. **Read FHEVM docs** - Official documentation
4. **Ask in community** - Zama Community Forum
5. **File issues** - GitHub repository

### Common Questions

**Q: Why are ratings encrypted?**
A: To keep supplier performance data private while supporting business operations.

**Q: How are comparisons private?**
A: Operations happen on encrypted data without decryption - actual values never revealed.

**Q: Can I compare suppliers with different owners?**
A: Yes, access control allows any owner to compare public suppliers.

**Q: How do I get decrypted values?**
A: Request async decryption through `requestRatingDecryption()` callback.

---

**Generated**: December 2025
**Example**: confidential-supplier-management
**Status**: Production Ready
**Version**: 1.0.0

---

*For more information, visit [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)*
