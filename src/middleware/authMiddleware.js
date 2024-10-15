const authMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY;
  
    if (apiKey && apiKey === validApiKey) {
      next();
    } else {
      res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  };
  
  module.exports = authMiddleware;
  