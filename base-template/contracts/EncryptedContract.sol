// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, euint8 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title Encrypted Contract Template
 * @notice Base template for FHEVM smart contracts
 * @dev This contract demonstrates basic FHE operations
 */
contract EncryptedContract is SepoliaConfig {
    // State variables with encrypted types
    mapping(address => euint32) private encryptedBalances;
    euint32 private totalSupply;

    /**
     * @dev Initialize with encrypted total supply
     * @param _initialSupply Initial supply value
     */
    function initialize(uint32 _initialSupply) external {
        euint32 encryptedSupply = FHE.asEuint32(_initialSupply);
        FHE.allowThis(encryptedSupply);
        FHE.allow(encryptedSupply, msg.sender);
        totalSupply = encryptedSupply;
    }

    /**
     * @dev Get contract balance (encrypted)
     * @return Encrypted balance
     */
    function getBalance() external view returns (euint32) {
        return encryptedBalances[msg.sender];
    }
}
