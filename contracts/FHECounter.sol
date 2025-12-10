// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title FHE Counter
 * @notice A simple encrypted counter demonstrating FHE arithmetic operations
 * @dev This example shows how to perform arithmetic on encrypted values
 *
 * ## Overview
 * This contract demonstrates the core FHE concept: performing computations
 * on encrypted data without ever decrypting the values during computation.
 *
 * ## Key Concepts Demonstrated
 * - Encrypted integer storage (euint32)
 * - FHE arithmetic operations (FHE.add, FHE.sub)
 * - Permission management (FHE.allow, FHE.allowThis)
 * - State updates with encrypted values
 *
 * ## Use Case
 * A counter that maintains privacy of the count value. Only the owner
 * can decrypt the value to see the actual count.
 */
contract FHECounter is SepoliaConfig {
    euint32 private _count;
    address public owner;

    event CounterIncremented(address indexed caller);
    event CounterDecremented(address indexed caller);
    event CounterReset(address indexed caller);

    constructor() {
        owner = msg.sender;
        // Initialize with encrypted value of 0
        euint32 initialCount = FHE.asEuint32(0);
        FHE.allowThis(initialCount);
        FHE.allow(initialCount, msg.sender);
        _count = initialCount;
    }

    /**
     * @dev Get the encrypted counter value
     * @return The encrypted count (only owner can decrypt)
     *
     * Note: This returns the encrypted value. To see the actual count,
     * you must request decryption through the callback mechanism.
     */
    function getCount() external view returns (euint32) {
        return _count;
    }

    /**
     * @dev Increment the counter by 1
     *
     * ## Pattern: FHE Arithmetic
     * This demonstrates how to perform arithmetic on encrypted values.
     * The operation happens on encrypted data without revealing the value.
     *
     * ## Steps:
     * 1. Create encrypted value 1
     * 2. Add to existing encrypted counter
     * 3. Update storage with new encrypted value
     * 4. Grant permissions for continued use
     */
    function increment() external {
        // Create encrypted value 1
        euint32 one = FHE.asEuint32(1);

        // Add to counter (both are encrypted)
        _count = FHE.add(_count, one);

        // Grant permissions for new value
        FHE.allowThis(_count);
        FHE.allow(_count, owner);

        emit CounterIncremented(msg.sender);
    }

    /**
     * @dev Increment by specific encrypted amount
     * @param inputEuint32 Encrypted amount to add
     * @param inputProof Proof of correct encryption
     *
     * ## Pattern: External Encrypted Input
     * This shows how to accept encrypted input from clients
     * and incorporate it into contract state.
     */
    function incrementByAmount(
        externalEuint32 inputEuint32,
        bytes calldata inputProof
    ) external {
        // Convert external encrypted input to internal representation
        euint32 amount = FHE.fromExternal(inputEuint32, inputProof);

        // Add to counter
        _count = FHE.add(_count, amount);

        // Grant permissions
        FHE.allowThis(_count);
        FHE.allow(_count, owner);

        emit CounterIncremented(msg.sender);
    }

    /**
     * @dev Decrement the counter by 1
     *
     * ## Pattern: FHE Subtraction
     * Similar to increment, but using FHE.sub for subtraction.
     */
    function decrement() external {
        // Create encrypted value 1
        euint32 one = FHE.asEuint32(1);

        // Subtract from counter
        _count = FHE.sub(_count, one);

        // Grant permissions
        FHE.allowThis(_count);
        FHE.allow(_count, owner);

        emit CounterDecremented(msg.sender);
    }

    /**
     * @dev Decrement by specific encrypted amount
     * @param inputEuint32 Encrypted amount to subtract
     * @param inputProof Proof of correct encryption
     */
    function decrementByAmount(
        externalEuint32 inputEuint32,
        bytes calldata inputProof
    ) external {
        // Convert external encrypted input
        euint32 amount = FHE.fromExternal(inputEuint32, inputProof);

        // Subtract from counter
        _count = FHE.sub(_count, amount);

        // Grant permissions
        FHE.allowThis(_count);
        FHE.allow(_count, owner);

        emit CounterDecremented(msg.sender);
    }

    /**
     * @dev Reset counter to 0 (owner only)
     */
    function reset() external {
        require(msg.sender == owner, "Only owner can reset");

        euint32 zero = FHE.asEuint32(0);
        FHE.allowThis(zero);
        FHE.allow(zero, owner);
        _count = zero;

        emit CounterReset(msg.sender);
    }

    /**
     * @dev Request decryption of counter value
     *
     * ## Pattern: Async Decryption
     * This shows how to request decryption of an encrypted value
     * through the callback mechanism. The decryption happens
     * asynchronously and the result is returned via callback.
     */
    function requestCountDecryption() external {
        require(msg.sender == owner, "Only owner can request decryption");

        bytes32[] memory cts = new bytes32[](1);
        cts[0] = FHE.toBytes32(_count);
        FHE.requestDecryption(cts, this.processCountDecryption.selector);
    }

    /**
     * @dev Callback function for decryption result
     * @param requestId ID of the decryption request
     * @param decryptedCount The decrypted counter value
     * @param signatures Signatures from decryption nodes
     *
     * ## Pattern: Decryption Callback
     * This is called by the network after decryption is complete.
     * In production, signature verification would validate the result.
     */
    function processCountDecryption(
        uint256 requestId,
        uint32 decryptedCount,
        bytes[] memory signatures
    ) external {
        // In production, verify signatures here
        // For this example, we trust the decrypted value

        // Emit event so off-chain systems know the count
        emit CountDecrypted(requestId, decryptedCount);
    }

    event CountDecrypted(uint256 indexed requestId, uint32 decryptedValue);
}
