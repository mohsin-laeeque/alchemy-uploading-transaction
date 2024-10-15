const { Network, Alchemy } = require('alchemy-sdk');

// Alchemy SDK settings
const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// Initialize the Alchemy SDK
const alchemy = new Alchemy(settings);


const getLatestBlockNumber = async () => {
  try {
    const blockNumber = await alchemy.core.getBlockNumber();
    return blockNumber;
  } catch (error) {
    console.error('Error fetching block number:', error);
    throw new Error(error.message);
  }
};

module.exports = { getLatestBlockNumber };
