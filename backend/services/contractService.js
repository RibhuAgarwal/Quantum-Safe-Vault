const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const Web3 = require("web3");
const fs = require("fs");

const RPC_URL = process.env.BLOCKCHAIN_RPC;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

if (!RPC_URL) throw new Error("Missing BLOCKCHAIN_RPC in .env");
if (!CONTRACT_ADDRESS) throw new Error("Missing CONTRACT_ADDRESS in .env");

console.log("BLOCKCHAIN_RPC =", RPC_URL);
console.log("CONTRACT_ADDRESS =", CONTRACT_ADDRESS);

// ✅ Initialize Web3
const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

// ✅ Load contract ABI
const contractPath = path.resolve(
  __dirname,
  "../../blockchain/artifacts/contracts/VaultManager.sol/VaultManager.json"
);
const contractJson = JSON.parse(fs.readFileSync(contractPath, "utf8"));
const contract = new web3.eth.Contract(contractJson.abi, CONTRACT_ADDRESS);

// ✅ Ensure contract is deployed
web3.eth.getCode(CONTRACT_ADDRESS).then((code) => {
  if (!code || code === "0x") {
    console.error("❌ No contract deployed at this address");
    process.exit(1);
  }
});

// ✅ Get default account (signer)
const getDefaultAccount = async () => {
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
};

// ✅ Create vault on chain (now with 3 parameters)
exports.createVaultOnChain = async (userAddress, ipfsHash, zkAuthHash) => {
  const from = await getDefaultAccount();
  const checksummed = web3.utils.toChecksumAddress(userAddress);

  console.log("📦 createVaultOnChain() called");
  console.log("→ Address:", checksummed);
  console.log("→ IPFS Hash:", ipfsHash);
  console.log("→ ZK Hash:", zkAuthHash);
  console.log("→ From:", from);

  // ✅ Ensure we pass 3 parameters: address, IPFS hash, ZK hash
  return await contract.methods
    .createVault(checksummed, ipfsHash, zkAuthHash) // 3 params: address, IPFS hash, ZK hash
    .send({ from, gas: 300000 });
};

// ✅ Get vault from chain (with 3 parameters to correctly fetch)
exports.getVaultFromChain = async (userAddress) => {
  try {
    const checksummed = web3.utils.toChecksumAddress(userAddress);
    console.log("📡 Fetching vault for:", checksummed);

    const vault = await contract.methods.getVault(checksummed).call();
    console.log("📦 Vault received:", vault);

    return {
      ipfsHash: vault[0],
      zkAuthHash: vault[1],
    };
  } catch (err) {
    console.error("❌ Error in getVaultFromChain:", err.message || err);
    throw err;
  }
};
