const express = require('express');
const router = express.Router();
const domainController = require('../controllers/domain.controller');

router.get('/', domainController.getAll);
router.get('/:id', domainController.getById);
router.post('/', domainController.create);
router.put('/:id', domainController.update);
router.delete('/:id', domainController.delete);

module.exports = router;