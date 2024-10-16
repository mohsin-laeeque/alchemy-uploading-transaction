// src/routes/index.js
const express = require('express');
const multer = require('multer');
const { getLatestBlockNumber } = require('../services/alchemyService');
const { sendTransaction } = require('../services/metaTransactionService');
const router = express.Router();

// Route to check Alchemy connection by fetching the latest block number
router.get('/check-alchemy', async (req, res) => {
  try {
    const blockNumber = await getLatestBlockNumber();
    res.status(200).json({ success: true, blockNumber });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const specifiedFilePath = 'uploads/transaction.json';
router.get('/process-transaction', async (req, res) => {
  try {
    const data = await sendTransaction(specifiedFilePath);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
