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
    console.log("Wallet Address:", walletAddress);

    const balance = await alchemy.core.getBalance(walletAddress);
    console.log("Balance:", Utils.formatEther(balance));

    const transaction = {
      from: transactionDetails.from, 
      to: transactionDetails.to, 
      value: parseInt(transactionDetails.value, 16), 
      gasLimit: parseInt(transactionDetails.gas, 16),
      maxPriorityFeePerGas: Utils.parseUnits("1.875", "gwei"),
      maxFeePerGas: Utils.parseUnits("2.5", "gwei"),
      nonce: parseInt(transactionDetails.nonce, 16),
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
