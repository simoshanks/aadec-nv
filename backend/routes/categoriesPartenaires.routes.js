const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesPartenaires.controller');

router.get('/', categoriesController.getAll);
router.get('/:id', categoriesController.getById);
router.post('/', categoriesController.create);
router.put('/:id', categoriesController.update);
router.delete('/:id', categoriesController.delete);

module.exports = router;