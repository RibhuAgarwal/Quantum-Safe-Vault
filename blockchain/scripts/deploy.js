const hre = require("hardhat");

async function main() {
  const VaultManager = await hre.ethers.getContractFactory("VaultManager");
  const vaultManager = await VaultManager.deploy();

  await vaultManager.waitForDeployment(); // ✅ New way instead of deployed()
  console.log("✅ VaultManager deployed to:", await vaultManager.getAddress());
}

main().catch((error) => {
  console.error("💥 Deployment error:", error);
  process.exitCode = 1;
});
