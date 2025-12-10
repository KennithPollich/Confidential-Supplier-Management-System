// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

/**
 * @title Simple Counter
 * @notice A basic counter for comparison with FHE Counter
 * @dev This contract shows a simple counter WITHOUT encryption
 *
 * ## Purpose
 * This contract is provided to compare against the FHECounter.
 * It demonstrates:
 * 1. How a regular counter works (public state)
 * 2. The difference when values are NOT encrypted
 * 3. Why FHE is needed for privacy
 *
 * ## Key Difference from FHECounter
 * - SimpleCounter: Public value, anyone can see the count
 * - FHECounter: Encrypted value, only owner can decrypt
 */
contract SimpleCounter {
    uint32 private _count;
    address public owner;

    event CounterIncremented(uint32 newValue);
    event CounterDecremented(uint32 newValue);
    event CounterReset();

    constructor() {
        owner = msg.sender;
        _count = 0;
    }

    /**
     * @dev Get the counter value (PUBLIC - everyone can see it!)
     * @return The current count value
     *
     * Note: This reveals the value to everyone!
     * Compare with FHECounter.getCount() which returns encrypted value
     */
    function getCount() external view returns (uint32) {
        return _count;
    }

    /**
     * @dev Increment the counter by 1
     *
     * Note: The new value is publicly visible in the storage
     */
    function increment() external {
        _count += 1;
        emit CounterIncremented(_count);
    }

    /**
     * @dev Increment the counter by specific amount
     * @param amount Amount to increment by
     *
     * Note: The operation and result are visible on-chain
     */
    function incrementByAmount(uint32 amount) external {
        _count += amount;
        emit CounterIncremented(_count);
    }

    /**
     * @dev Decrement the counter by 1
     *
     * Note: The new value is publicly visible
     */
    function decrement() external {
        require(_count >= 1, "Cannot decrement below zero");
        _count -= 1;
        emit CounterDecremented(_count);
    }

    /**
     * @dev Decrement the counter by specific amount
     * @param amount Amount to decrement by
     */
    function decrementByAmount(uint32 amount) external {
        require(_count >= amount, "Cannot decrement below zero");
        _count -= amount;
        emit CounterDecremented(_count);
    }

    /**
     * @dev Reset counter to 0 (owner only)
     */
    function reset() external {
        require(msg.sender == owner, "Only owner can reset");
        _count = 0;
        emit CounterReset();
    }

    /**
     * @dev Get counter value (same as getCount, but explicit name)
     * @return The current count
     */
    function read() external view returns (uint32) {
        return _count;
    }
}
