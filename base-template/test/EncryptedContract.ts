import { expect } from "chai";
import { ethers } from "hardhat";
import { EncryptedContract } from "../typechain-types";

/**
 * Test Suite: Encrypted Contract Template
 * Tests basic FHE operations and contract initialization
 */
describe("EncryptedContract", function () {
  let contract: EncryptedContract;
  let owner: any;
  let other: any;

  beforeEach(async function () {
    const [signer1, signer2] = await ethers.getSigners();
    owner = signer1;
    other = signer2;

    const EncryptedContractFactory = await ethers.getContractFactory("EncryptedContract");
    contract = await EncryptedContractFactory.deploy();
    await contract.deployed();
  });

  describe("Initialization", function () {
    it("Should initialize with encrypted supply", async function () {
      const tx = await contract.connect(owner).initialize(1000);
      expect(tx).to.not.be.undefined;
    });
  });

  describe("Balance Operations", function () {
    beforeEach(async function () {
      await contract.connect(owner).initialize(1000);
    });

    it("Should return encrypted balance", async function () {
      const balance = await contract.connect(owner).getBalance();
      expect(balance).to.not.be.undefined;
    });
  });
});
