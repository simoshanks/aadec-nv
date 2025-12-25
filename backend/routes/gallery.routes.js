const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/gallery.controller');

router.get('/project/:projectId', galleryController.getByProject);
router.post('/upload', galleryController.uploadImage);
router.delete('/:id', galleryController.delete);

module.exports = router;