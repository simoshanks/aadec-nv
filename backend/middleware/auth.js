const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const protect = async (req, res, next) => {
  if (!req.headers.authorization?.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Non autorisé' });
  }

  try {
    const token = req.headers.authorization.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    const [rows] = await pool.query(
      'SELECT id, username, email FROM admin WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Non autorisé' });
  }
};

module.exports = { protect };
