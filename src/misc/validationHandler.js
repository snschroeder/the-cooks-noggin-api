const { API_TOKEN } = require('../config');
const logger = require('./logger');


// eslint-disable-next-line consistent-return
function validateBearerToken(req, res, next) {
  const authToken = req.get('authorization');
  if (!authToken || authToken.split(' ')[0] !== 'Bearer' || authToken.split(' ')[1] !== API_TOKEN) {
    logger.error(`401 error on path: ${req.path} - Unauthorized request`);
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
}

module.exports = validateBearerToken;
