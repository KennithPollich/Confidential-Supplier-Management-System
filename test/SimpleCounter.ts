import { expect } from "chai";
import { ethers } from "hardhat";
import { SimpleCounter } from "../typechain-types";

/**
 * Test Suite: Simple Counter
 * Category: basic
 * Chapter: comparison, non-encrypted
 *
 * Purpose: Demonstrate a basic counter for comparison with FHECounter
 * This shows what happens when data is NOT encrypted
 */
describe("SimpleCounter", function () {
  let contract: SimpleCounter;
  let owner: any;
  let other: any;

  beforeEach(async function () {
    const [signer1, signer2] = await ethers.getSigners();
    owner = signer1;
    other = signer2;

    const SimpleCounterFactory = await ethers.getContractFactory("SimpleCounter");
    contract = await SimpleCounterFactory.deploy();
    await contract.deployed();
  });

  describe("Initialization", function () {
    it("✅ CORRECT: Counter initializes with owner", async function () {
      const contractOwner = await contract.owner();
      expect(contractOwner).to.equal(owner.address);
    });

    it("✅ CORRECT: Counter starts at zero", async function () {
      const count = await contract.getCount();
      expect(count).to.equal(0);
    });

    it("✅ CORRECT: Initial value is publicly visible", async function () {
      // Anyone can read the count
      const countOwner = await contract.connect(owner).getCount();
      const countOther = await contract.connect(other).getCount();

      // Both see the same value (it's public)
      expect(countOwner).to.equal(countOther);
      expect(countOwner).to.equal(0);
    });
  });

  describe("Increment Operations", function () {
    it("✅ CORRECT: Can increment counter", async function () {
      await contract.connect(owner).increment();
      const count = await contract.getCount();
      expect(count).to.equal(1);
    });

    it("✅ CORRECT: Multiple increments work", async function () {
      await contract.connect(owner).increment();
      await contract.connect(owner).increment();
      await contract.connect(owner).increment();

      const count = await contract.getCount();
      expect(count).to.equal(3);
    });

    it("✅ CORRECT: Non-owner can increment (public function)", async function () {
      await contract.connect(other).increment();
      const count = await contract.getCount();
      expect(count).to.equal(1);
    });

    it("✅ CORRECT: Increment by amount", async function () {
      await contract.connect(owner).incrementByAmount(5);
      const count = await contract.getCount();
      expect(count).to.equal(5);
    });

    it("✅ CORRECT: Increment by amount multiple times", async function () {
      await contract.connect(owner).incrementByAmount(10);
      await contract.connect(owner).incrementByAmount(5);
      await contract.connect(other).incrementByAmount(3);

      const count = await contract.getCount();
      expect(count).to.equal(18);
    });

    it("✅ CORRECT: Anyone can see all increments immediately", async function () {
      // Owner increments
      await contract.connect(owner).increment();

      // Other user sees it immediately (public)
      const count = await contract.connect(other).getCount();
      expect(count).to.equal(1);

      // This is different from FHECounter where value is encrypted
    });
  });

  describe("Decrement Operations", function () {
    beforeEach(async function () {
      await contract.connect(owner).incrementByAmount(10);
    });

    it("✅ CORRECT: Can decrement counter", async function () {
      await contract.connect(owner).decrement();
      const count = await contract.getCount();
      expect(count).to.equal(9);
    });

    it("✅ CORRECT: Multiple decrements work", async function () {
      await contract.connect(owner).decrement();
      await contract.connect(owner).decrement();
      await contract.connect(owner).decrement();

      const count = await contract.getCount();
      expect(count).to.equal(7);
    });

    it("✅ CORRECT: Decrement by amount", async function () {
      await contract.connect(owner).decrementByAmount(3);
      const count = await contract.getCount();
      expect(count).to.equal(7);
    });

    it("❌ INCORRECT: Cannot decrement below zero", async function () {
      await expect(
        contract.connect(owner).decrementByAmount(15)
      ).to.be.revertedWith("Cannot decrement below zero");
    });

    it("❌ INCORRECT: Cannot single decrement from zero", async function () {
      await contract.connect(owner).reset();
      await expect(
        contract.connect(owner).decrement()
      ).to.be.revertedWith("Cannot decrement below zero");
    });

    it("✅ CORRECT: Anyone can see decrements immediately", async function () {
      // Owner decrements
      await contract.connect(owner).decrement();

      // Other sees it immediately (public)
      const count = await contract.connect(other).getCount();
      expect(count).to.equal(9);
    });
  });

  describe("Reset Operations", function () {
    beforeEach(async function () {
      await contract.connect(owner).incrementByAmount(100);
    });

    it("✅ CORRECT: Owner can reset counter", async function () {
      await contract.connect(owner).reset();
      const count = await contract.getCount();
      expect(count).to.equal(0);
    });

    it("❌ INCORRECT: Non-owner cannot reset counter", async function () {
      await expect(
        contract.connect(other).reset()
      ).to.be.revertedWith("Only owner can reset");
    });

    it("✅ CORRECT: Reset is publicly visible", async function () {
      await contract.connect(owner).reset();

      // Everyone sees the reset
      const countOwner = await contract.connect(owner).getCount();
      const countOther = await contract.connect(other).getCount();

      expect(countOwner).to.equal(0);
      expect(countOther).to.equal(0);
    });
  });

  describe("Read Function", function () {
    it("✅ CORRECT: Read returns same as getCount", async function () {
      await contract.connect(owner).incrementByAmount(7);

      const getCountValue = await contract.getCount();
      const readValue = await contract.read();

      expect(getCountValue).to.equal(readValue);
    });
  });

  describe("Privacy Implications", function () {
    it("❌ NOTE: All values are publicly visible (no encryption)", async function () {
      // This test demonstrates why SimpleCounter needs FHE

      // Owner tries to keep value private
      await contract.connect(owner).incrementByAmount(12345);

      // But anyone can see it
      const countFromAnyAccount = await contract.connect(other).getCount();
      expect(countFromAnyAccount).to.equal(12345);

      // There's no privacy!
      // This is why we need FHECounter for sensitive data
    });

    it("✅ COMPARE: SimpleCounter vs FHECounter", async function () {
      // SimpleCounter: Public value (everyone sees 1)
      await contract.connect(owner).increment();
      const simpleFinal = await contract.getCount();
      expect(simpleFinal).to.equal(1);

      // FHECounter: Encrypted value (only owner can decrypt)
      // With FHECounter, the value 1 would be encrypted
      // and only the owner could decrypt it

      // This demonstrates the key difference
    });
  });

  describe("Events", function () {
    it("✅ CORRECT: Increment emits event with new value", async function () {
      const tx = await contract.connect(owner).increment();
      expect(tx).to.emit(contract, "CounterIncremented").withArgs(1);
    });

    it("✅ CORRECT: Decrement emits event with new value", async function () {
      await contract.connect(owner).increment();
      await contract.connect(owner).increment();

      const tx = await contract.connect(owner).decrement();
      expect(tx).to.emit(contract, "CounterDecremented").withArgs(1);
    });

    it("✅ CORRECT: Reset emits event", async function () {
      await contract.connect(owner).increment();

      const tx = await contract.connect(owner).reset();
      expect(tx).to.emit(contract, "CounterReset");
    });
  });

  describe("Complex Workflows", function () {
    it("✅ CORRECT: Realistic usage pattern", async function () {
      // Build up
      await contract.connect(owner).incrementByAmount(50);
      let count = await contract.getCount();
      expect(count).to.equal(50);

      // Decrease some
      await contract.connect(owner).decrementByAmount(10);
      count = await contract.getCount();
      expect(count).to.equal(40);

      // Add more
      await contract.connect(owner).incrementByAmount(20);
      count = await contract.getCount();
      expect(count).to.equal(60);

      // Reset
      await contract.connect(owner).reset();
      count = await contract.getCount();
      expect(count).to.equal(0);
    });

    it("✅ CORRECT: Multi-user interactions", async function () {
      // Owner increments
      await contract.connect(owner).incrementByAmount(100);

      // Other increments
      await contract.connect(other).incrementByAmount(50);

      // All see the same public value
      const count = await contract.getCount();
      expect(count).to.equal(150);
    });
  });
});
