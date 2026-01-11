const express = require('express');
const router = express.Router();
const multer = require('multer');
const projectController = require('../controllers/projects.controller');

/* MULTER CONFIG */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/projects');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

/* ROUTES */
router.get('/', projectController.getAll);
router.get('/domain/:domainId', projectController.getByDomain);
router.get('/:id', projectController.getById);

router.post('/', upload.single('photo'), projectController.create);
router.put('/:id', upload.single('photo'), projectController.update);

router.delete('/:id', projectController.delete);

module.exports = router;
