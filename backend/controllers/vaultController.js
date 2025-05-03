const axios = require("axios");
const Web3 = require("web3");
const web3 = new Web3(); // local utils instance for checksum conversion

const {
  createVaultOnChain,
  getVaultFromChain,
} = require("../services/contractService");
const { uploadToIPFS, fetchFromIPFS } = require("../services/ipfsService");

const CRYPTO_API = process.env.CRYPTO_API || "http://localhost:5000";

// 🧱 CREATE VAULT
exports.createVault = async (req, res) => {
  let { address, password, data, zkHash } = req.body;

  // Validate required fields
  if (!address || !password || !data) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Generate the checksummed address
    const checksummed = web3.utils.toChecksumAddress(address.trim());
    console.log("🧱 Checksummed address (create):", checksummed);

    // Encrypt vault data
    const encRes = await axios.post(`${CRYPTO_API}/encrypt`, {
      text: data,
      password,
    });
    const encryptedVault = encRes.data.encrypted;

    // Upload encrypted data to IPFS
    const ipfsHash = await uploadToIPFS(encryptedVault);

    // Store on-chain by passing 3 parameters: user address, IPFS hash, zkHash
    try {
      await createVaultOnChain(checksummed, ipfsHash, zkHash);
      return res.status(200).json({ message: "Vault created", ipfsHash });
    } catch (err) {
      const reason = err?.data?.message || err.message;
      if (reason.includes("Vault already exists")) {
        return res.status(409).json({ error: "Vault already exists for this address" });
      }
      throw err;
    }
  } catch (err) {
    console.error("💥 Backend Error in createVault:", err.message || err);
    return res.status(500).json({
      error: "Failed to create vault: " + (err.message || err),
    });
  }
};

// 🔓 DECRYPT VAULT
exports.decryptVault = async (req, res) => {
  let { address, password } = req.body;

  // Validate required fields
  if (!address || !password) {
    return res.status(400).json({ error: "Missing address or password" });
  }

  try {
    // Generate checksummed address for consistency
    const checksummed = web3.utils.toChecksumAddress(address.trim());
    console.log("🔐 Checksummed address (decrypt):", checksummed);

    // Retrieve the vault data (IPFS hash and zkAuthHash)
    const { ipfsHash } = await getVaultFromChain(checksummed);
    if (!ipfsHash) {
      return res.status(404).json({ error: "No vault found for this address" });
    }

    // Fetch encrypted vault content from IPFS
    const encryptedVault = await fetchFromIPFS(ipfsHash);

    // Decrypt the vault data via the crypto API
    const decRes = await axios.post(`${CRYPTO_API}/decrypt`, {
      encrypted: encryptedVault,
      password,
    });
    const decrypted = decRes.data?.decrypted;
    if (!decrypted) {
      return res.status(500).json({ error: "Decryption failed: Invalid response" });
    }

    res.status(200).json({ decrypted });
  } catch (err) {
    console.error("❌ Backend Error in decryptVault:", err.message || err);
    res.status(500).json({
      error: "Vault decryption failed: " + (err.response?.data?.error || err.message),
    });
  }
};

// 📦 GET VAULT METADATA
exports.getVault = async (req, res) => {
  let address = req.params.address?.trim();
  if (!address) {
    return res.status(400).json({ error: "Invalid address" });
  }

  try {
    const checksummed = web3.utils.toChecksumAddress(address);
    const vault = await getVaultFromChain(checksummed);
    if (!vault || !vault.ipfsHash) {
      return res.status(404).json({ error: "No vault found" });
    }
    res.status(200).json(vault);
  } catch (err) {
    console.error("❌ Error fetching vault metadata:", err.message || err);
    res.status(500).json({ error: "Failed to retrieve vault metadata" });
  }
};
