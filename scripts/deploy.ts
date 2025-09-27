import { ethers } from "ethers";
import expenseSplitterData from "./abis/ExpenseContract.json";

export const deployContract = async () => {
  const provider = new ethers.JsonRpcProvider(
    "https://rpc.blaze.soniclabs.com"
  );
  const wallet = new ethers.Wallet(
    process.env.NEXT_PUBLIC_PRIVATE_KEY || "",
    provider
  );

  console.log("Deploying contracts...");

  // Deploy ExpenseSplitter contract
  console.log("Deploying ExpenseSplitter contract...");
  const expenseSplitterFactory = new ethers.ContractFactory(
    expenseSplitterData.abi,
    expenseSplitterData.bytecode,
    wallet
  );
  const expenseSplitterContract = await expenseSplitterFactory.deploy();
  const expenseSplitterAddress = await expenseSplitterContract.getAddress();
  await expenseSplitterContract.waitForDeployment();

  console.log("Deployed ExpenseSplitter contract: ", expenseSplitterAddress);
};

deployContract();
