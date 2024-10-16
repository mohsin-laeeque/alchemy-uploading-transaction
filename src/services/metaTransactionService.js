const fs = require('fs');
const { Alchemy, Network, Wallet, Utils } = require("alchemy-sdk");
require('dotenv').config();

// Alchemy SDK settings
const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// Initialize the Alchemy SDK
const alchemy = new Alchemy(settings);
const wallet = new Wallet(process.env.WALLET_PRIVATE_KEY);

const sendTransaction = async (filePath) => {
  try {
    // Read transaction details from the provided JSON file
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data); 
    const transactionDetails = jsonData.meta_transaction;
    
    if (!transactionDetails) {
      throw new Error('Transaction details are undefined in the JSON data.');
    }
    const walletAddress = await wallet.getAddress(); 
    const balance = await alchemy.core.getBalance(walletAddress);
    const currentNonce = await alchemy.core.getTransactionCount(walletAddress, "latest");
    const priorityGasFee = await alchemy.transact.getMaxPriorityFeePerGas();
    const latestBlock = await alchemy.core.getBlock("latest");
    const baseFeePerGas = latestBlock.baseFeePerGas;
    const maxFeePerGas = Utils.parseUnits((parseFloat(Utils.formatUnits(baseFeePerGas, "gwei")) + parseFloat(Utils.formatUnits(priorityGasFee, "gwei")) + 2).toString(), "gwei");

    // Calculate Estimate Gas
    const params = {
      to: transactionDetails.to,
      data: transactionDetails.data,
      value: transactionDetails.value,
    };
    const estimateGas = await alchemy.transact.estimateGas(params);

    const transaction = {
      from: transactionDetails.from, 
      to: transactionDetails.to, 
      value: parseInt(transactionDetails.value, 16), 
      gasLimit: estimateGas,
      maxPriorityFeePerGas: priorityGasFee,
      maxFeePerGas: maxFeePerGas,
      nonce: currentNonce,
      type: 2, 
      chainId: parseInt(transactionDetails.chainId, 16),
    };
    // Sign the transaction with the wallet
    const rawTransaction = await wallet.signTransaction(transaction);
    const response = await alchemy.transact.sendTransaction(rawTransaction);   
    return response;
  } catch (error) {
    console.error('Error uploading transaction:', error);
    throw new Error(error.message);
  }
};

module.exports = { sendTransaction };
