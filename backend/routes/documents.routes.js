const express = require('express');
const router = express.Router();
const documentsController = require('../controllers/documents.controller');

// Routes
router.get('/', documentsController.getAll);
router.get('/:id', documentsController.getById);
router.post('/upload', documentsController.uploadDocument);
router.put('/:id', documentsController.update);
router.delete('/:id', documentsController.delete);

module.exports = router;