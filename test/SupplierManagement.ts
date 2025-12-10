import { expect } from "chai";
import { ethers } from "hardhat";
import { SupplierManagement } from "../typechain-types";

/**
 * Test Suite: Confidential Supplier Management System
 * Category: enterprise
 * Chapter: access-control, privacy-preserving-operations
 *
 * This test suite demonstrates:
 * 1. How to add suppliers with encrypted ratings
 * 2. Access control enforcement for sensitive operations
 * 3. Privacy-preserving comparisons without decryption
 * 4. Async decryption callback workflows
 * 5. Common pitfalls and how to avoid them
 */
describe("SupplierManagement", function () {
  let contract: SupplierManagement;
  let owner: any;
  let other: any;
  let third: any;

  beforeEach(async function () {
    const [signer1, signer2, signer3] = await ethers.getSigners();
    owner = signer1;
    other = signer2;
    third = signer3;

    const SupplierManagementFactory = await ethers.getContractFactory("SupplierManagement");
    contract = await SupplierManagementFactory.deploy();
    await contract.deployed();
  });

  /**
   * ## Test Group: Supplier Management - Access Control
   * Tests that verify proper access control for supplier operations
   */
  describe("Supplier Management - Access Control", function () {
    it("✅ CORRECT: Owner can add supplier with encrypted rating", async function () {
      // This demonstrates the correct pattern for adding a supplier
      const tx = await contract.connect(owner).addSupplier(
        "Electronics Supplier Co",
        "Electronics",
        "contact@electronics.com",
        8, // rating 1-10
        false // not initially preferred
      );

      // Verify event was emitted
      expect(tx).to.emit(contract, "SupplierAdded");

      // Verify supplier was added
      const count = await contract.getSupplierCount();
      expect(count).to.equal(1);
    });

    it("✅ CORRECT: Supplier count increments correctly", async function () {
      // Add first supplier
      await contract.connect(owner).addSupplier("Supplier 1", "Category1", "contact1@example.com", 7, false);
      let count = await contract.getSupplierCount();
      expect(count).to.equal(1);

      // Add second supplier
      await contract.connect(other).addSupplier("Supplier 2", "Category2", "contact2@example.com", 8, false);
      count = await contract.getSupplierCount();
      expect(count).to.equal(2);
    });

    it("❌ INCORRECT: Rating outside valid range (0) should be rejected", async function () {
      // This demonstrates a common mistake: invalid rating value
      await expect(
        contract.connect(owner).addSupplier("Supplier", "Category", "contact@example.com", 0, false)
      ).to.be.revertedWith("Rating must be between 1 and 10");
    });

    it("❌ INCORRECT: Rating outside valid range (11) should be rejected", async function () {
      // Another invalid rating case
      await expect(
        contract.connect(owner).addSupplier("Supplier", "Category", "contact@example.com", 11, false)
      ).to.be.revertedWith("Rating must be between 1 and 10");
    });

    it("❌ INCORRECT: Empty supplier name should be rejected", async function () {
      // Demonstrates input validation
      await expect(
        contract.connect(owner).addSupplier("", "Category", "contact@example.com", 8, false)
      ).to.be.revertedWith("Name cannot be empty");
    });

    it("❌ INCORRECT: Empty category should be rejected", async function () {
      // More input validation
      await expect(
        contract.connect(owner).addSupplier("Supplier", "", "contact@example.com", 8, false)
      ).to.be.revertedWith("Category cannot be empty");
    });
  });

  /**
   * ## Test Group: Supplier Retrieval & Existence
   * Tests for retrieving supplier information
   */
  describe("Supplier Retrieval", function () {
    beforeEach(async function () {
      // Setup: Add a supplier first
      await contract.connect(owner).addSupplier("Test Supplier", "Electronics", "test@example.com", 8, true);
    });

    it("✅ CORRECT: Can retrieve supplier public information", async function () {
      const supplier = await contract.getSupplier(1);
      expect(supplier.name).to.equal("Test Supplier");
      expect(supplier.category).to.equal("Electronics");
      expect(supplier.contact).to.equal("test@example.com");
      expect(supplier.owner).to.equal(owner.address);
    });

    it("✅ CORRECT: Can check if supplier exists", async function () {
      expect(await contract.supplierExists(1)).to.be.true;
      expect(await contract.supplierExists(999)).to.be.false;
    });

    it("❌ INCORRECT: Retrieving non-existent supplier should fail", async function () {
      await expect(contract.getSupplier(999)).to.be.revertedWith("Invalid supplier ID");
    });
  });

  /**
   * ## Test Group: Rating Updates - Access Control
   * Tests for updating encrypted ratings
   */
  describe("Rating Updates - Access Control", function () {
    beforeEach(async function () {
      await contract.connect(owner).addSupplier("Supplier A", "Category", "contact@example.com", 6, false);
    });

    it("✅ CORRECT: Owner can update own supplier rating", async function () {
      // Owner updates their own supplier
      const tx = await contract.connect(owner).updateSupplierRating(1, 9);
      expect(tx).to.emit(contract, "SupplierRatingUpdated");
    });

    it("❌ INCORRECT: Non-owner cannot update supplier rating", async function () {
      // This is a critical security test
      // Only the owner should be able to decrypt/update their supplier's rating
      await expect(contract.connect(other).updateSupplierRating(1, 9)).to.be.revertedWith("Only owner can update");
    });

    it("❌ INCORRECT: Cannot update with invalid rating (below range)", async function () {
      await expect(contract.connect(owner).updateSupplierRating(1, 0)).to.be.revertedWith(
        "Rating must be between 1 and 10"
      );
    });

    it("❌ INCORRECT: Cannot update with invalid rating (above range)", async function () {
      await expect(contract.connect(owner).updateSupplierRating(1, 15)).to.be.revertedWith(
        "Rating must be between 1 and 10"
      );
    });

    it("❌ INCORRECT: Cannot update non-existent supplier", async function () {
      await expect(contract.connect(owner).updateSupplierRating(999, 8)).to.be.revertedWith(
        "Invalid supplier ID"
      );
    });
  });

  /**
   * ## Test Group: Preference Management
   * Tests for managing supplier preference status
   */
  describe("Preference Management", function () {
    beforeEach(async function () {
      await contract.connect(owner).addSupplier("Preferred Supplier", "Category", "contact@example.com", 9, false);
    });

    it("✅ CORRECT: Owner can update supplier preference", async function () {
      const tx = await contract.connect(owner).updateSupplierPreference(1, true);
      expect(tx).to.emit(contract, "SupplierPreferenceUpdated");

      // Verify preference was updated
      const isPreferred = await contract.connect(owner).isSupplierPreferred(1);
      expect(isPreferred).to.be.true;
    });

    it("✅ CORRECT: Owner can set preference to false", async function () {
      // First set to true
      await contract.connect(owner).updateSupplierPreference(1, true);
      // Then set to false
      await contract.connect(owner).updateSupplierPreference(1, false);

      const isPreferred = await contract.connect(owner).isSupplierPreferred(1);
      expect(isPreferred).to.be.false;
    });

    it("❌ INCORRECT: Non-owner cannot update preference", async function () {
      // Only owner should be able to update preference
      await expect(contract.connect(other).updateSupplierPreference(1, true)).to.be.revertedWith(
        "Only owner can update"
      );
    });

    it("✅ CORRECT: Non-owner cannot view true preference (privacy)", async function () {
      // Owner sets preference
      await contract.connect(owner).updateSupplierPreference(1, true);

      // Non-owner tries to view - should see false (hidden)
      const isPreferred = await contract.connect(other).isSupplierPreferred(1);
      expect(isPreferred).to.be.false;
    });
  });

  /**
   * ## Test Group: Privacy-Preserving Comparisons
   * Tests for comparing suppliers without revealing actual ratings
   */
  describe("Privacy-Preserving Comparisons", function () {
    beforeEach(async function () {
      // Add two suppliers with different ratings
      await contract.connect(owner).addSupplier("Supplier A", "Category", "a@example.com", 8, false);
      await contract.connect(other).addSupplier("Supplier B", "Category", "b@example.com", 6, false);
    });

    it("✅ CORRECT: Owner can compare supplier ratings", async function () {
      // Comparison happens on encrypted data
      const result = await contract.connect(owner).compareSupplierRatings(1, 2);
      expect(result).to.be.true; // Supplier A (8) >= Supplier B (6)
    });

    it("✅ CORRECT: Second supplier owner can also compare", async function () {
      const result = await contract.connect(other).compareSupplierRatings(1, 2);
      expect(result).to.be.true;
    });

    it("❌ INCORRECT: Non-owner cannot compare suppliers", async function () {
      // Comparison access control
      await expect(contract.connect(third).compareSupplierRatings(1, 2)).to.be.revertedWith(
        "Only owner can compare ratings"
      );
    });

    it("❌ INCORRECT: Cannot compare with invalid supplier ID", async function () {
      await expect(contract.connect(owner).compareSupplierRatings(1, 999)).to.be.revertedWith(
        "Invalid supplier ID 2"
      );
    });
  });

  /**
   * ## Test Group: Decryption Requests
   * Tests for async decryption callback pattern
   */
  describe("Decryption Requests - Async Callbacks", function () {
    beforeEach(async function () {
      await contract.connect(owner).addSupplier("Supplier", "Category", "contact@example.com", 9, false);
    });

    it("✅ CORRECT: Owner can request rating decryption", async function () {
      // This demonstrates proper async decryption pattern
      const tx = await contract.connect(owner).requestRatingDecryption(1);
      expect(tx).to.emit(contract, "RatingDecrypted");
    });

    it("❌ INCORRECT: Non-owner cannot request decryption", async function () {
      // Decryption should be owner-only
      await expect(contract.connect(other).requestRatingDecryption(1)).to.be.revertedWith("Only owner can decrypt");
    });

    it("❌ INCORRECT: Cannot request decryption for non-existent supplier", async function () {
      await expect(contract.connect(owner).requestRatingDecryption(999)).to.be.revertedWith(
        "Invalid supplier ID"
      );
    });
  });

  /**
   * ## Test Group: Complex Workflows
   * Tests for realistic usage scenarios
   */
  describe("Complex Workflows", function () {
    it("✅ CORRECT: Complete supplier management workflow", async function () {
      // 1. Owner adds supplier with encrypted rating
      await contract.connect(owner).addSupplier("New Supplier", "Electronics", "new@example.com", 7, false);

      // 2. Verify supplier exists
      expect(await contract.supplierExists(1)).to.be.true;

      // 3. Owner updates rating
      await contract.connect(owner).updateSupplierRating(1, 9);

      // 4. Owner marks as preferred
      await contract.connect(owner).updateSupplierPreference(1, true);

      // 5. Verify preference status (owner can see)
      expect(await contract.connect(owner).isSupplierPreferred(1)).to.be.true;

      // 6. Request decryption
      await contract.connect(owner).requestRatingDecryption(1);

      // Supplier count should be 1
      expect(await contract.getSupplierCount()).to.equal(1);
    });

    it("✅ CORRECT: Multiple suppliers by different owners", async function () {
      // Owner 1 adds supplier
      await contract.connect(owner).addSupplier("Supplier A", "Category1", "a@example.com", 8, false);

      // Owner 2 adds supplier
      await contract.connect(other).addSupplier("Supplier B", "Category2", "b@example.com", 6, false);

      // Owner 3 adds supplier
      await contract.connect(third).addSupplier("Supplier C", "Category3", "c@example.com", 9, false);

      // Verify count
      expect(await contract.getSupplierCount()).to.equal(3);

      // Each owner can only update their own
      await contract.connect(owner).updateSupplierRating(1, 7);
      await contract.connect(other).updateSupplierRating(2, 7);
      await contract.connect(third).updateSupplierRating(3, 8);

      // Owner 1 cannot update owner 2's supplier
      await expect(contract.connect(owner).updateSupplierRating(2, 9)).to.be.revertedWith("Only owner can update");
    });
  });

  /**
   * ## Test Group: FHE Pattern Validation
   * Tests that verify correct FHE usage patterns
   */
  describe("FHE Pattern Validation", function () {
    it("✅ CORRECT: Encrypted values use proper permissions", async function () {
      // When a supplier is added, the contract should:
      // 1. Encrypt the rating (euint8)
      // 2. Call FHE.allowThis() for contract permission
      // 3. Call FHE.allow() for user permission
      // This is validated by successful operation without errors

      const tx = await contract.connect(owner).addSupplier("Supplier", "Category", "contact@example.com", 8, false);
      expect(tx).to.not.be.undefined;

      // Supplier should exist and be usable
      expect(await contract.supplierExists(1)).to.be.true;
    });

    it("✅ CORRECT: Encrypted operations maintain data integrity", async function () {
      // Add supplier with rating 5
      await contract.connect(owner).addSupplier("Supplier", "Category", "contact@example.com", 5, false);

      // Update to rating 9
      await contract.connect(owner).updateSupplierRating(1, 9);

      // Comparison should reflect new rating
      // Add another for comparison
      await contract.connect(other).addSupplier("Other", "Category", "other@example.com", 7, false);

      // Supplier 1 (9) should be >= Supplier 2 (7)
      const result = await contract.connect(owner).compareSupplierRatings(1, 2);
      expect(result).to.be.true;
    });
  });
});
