const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects.controller');

router.get('/', projectsController.getAll);
router.get('/domain/:domainId', projectsController.getByDomain);
router.get('/:id', projectsController.getById);
router.post('/', projectsController.create);
router.put('/:id', projectsController.update);
router.delete('/:id', projectsController.delete);

module.exports = router;