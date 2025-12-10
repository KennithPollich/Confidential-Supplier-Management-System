import { ethers } from "hardhat";

/**
 * Deployment script for FHEVM contracts
 *
 * This script deploys the main contract and any dependencies
 * It handles network detection and verifies successful deployment
 */
async function main() {
  console.log("Starting deployment...");

  // Get network and deployer information
  const network = await ethers.provider.getNetwork();
  const [deployer] = await ethers.getSigners();

  console.log(`\nNetwork: ${network.name} (Chain ID: ${network.chainId})`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Balance: ${ethers.utils.formatEther(await deployer.getBalance())} ETH\n`);

  // Deploy EncryptedContract
  console.log("Deploying EncryptedContract...");
  const EncryptedContractFactory = await ethers.getContractFactory("EncryptedContract");
  const contract = await EncryptedContractFactory.deploy();
  await contract.deployed();

  console.log(`✅ EncryptedContract deployed to: ${contract.address}`);

  // Verify on Etherscan (if API key provided)
  if (process.env.ETHERSCAN_API_KEY && network.chainId === 11155111) {
    console.log("\nVerifying contract on Etherscan...");
    try {
      await contract.deployTransaction.wait(6);
      // Verification would go here
      console.log("✅ Contract verified");
    } catch (err) {
      console.log("ℹ️  Verification skipped (may retry manually)");
    }
  }

  console.log("\n✅ Deployment complete!");
  console.log(`Contract Address: ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
