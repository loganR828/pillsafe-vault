import { ethers } from "hardhat";

async function main() {
  console.log("Deploying PillSafe Vault...");

  // Get the contract factory
  const PillSafeVault = await ethers.getContractFactory("PillSafeVault");

  // Deploy the contract with a verifier address (you can change this to your verifier address)
  const verifierAddress = "0x1234567890123456789012345678901234567890"; // Replace with actual verifier address
  
  const pillSafeVault = await PillSafeVault.deploy(verifierAddress);

  await pillSafeVault.waitForDeployment();

  const contractAddress = await pillSafeVault.getAddress();
  
  console.log("PillSafe Vault deployed to:", contractAddress);
  console.log("Verifier address:", verifierAddress);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    verifierAddress,
    network: "sepolia",
    deployedAt: new Date().toISOString(),
    deployer: await ethers.provider.getSigner().getAddress()
  };
  
  console.log("Deployment completed successfully!");
  console.log("Contract Address:", deploymentInfo.contractAddress);
  console.log("Network:", deploymentInfo.network);
  console.log("Deployer:", deploymentInfo.deployer);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
