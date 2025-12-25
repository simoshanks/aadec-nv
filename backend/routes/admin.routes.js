const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth');  

router.post('/login', adminController.login);
router.put('/change-password', protect, adminController.changePassword);

module.exports = router;