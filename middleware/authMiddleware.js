const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authConfig = require('../config/authConfig');

async function authMiddleware(req, res, next) {
  try {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ message: 'Token tidak disediakan' });
    }

    const decoded = jwt.verify(token, authConfig.secret);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Token tidak valid' });
    }

    req.userId = user.id;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Token tidak valid' });
  }
}

module.exports = authMiddleware;
