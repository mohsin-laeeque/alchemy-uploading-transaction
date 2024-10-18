require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(authMiddleware); 

// API Routes
app.use('/api', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
