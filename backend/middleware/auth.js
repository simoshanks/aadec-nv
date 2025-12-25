const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const [rows] = await pool.query('SELECT * FROM admin WHERE id = ?', [decoded.id]);
      
      if (rows.length === 0) {
        return res.status(401).json({ message: 'Utilisateur non autorisé' });
      }
      
      req.user = rows[0];
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Token non valide' });
    }
  } else {
    return res.status(401).json({ message: 'Token manquant' });
  }
};

module.exports = { protect };