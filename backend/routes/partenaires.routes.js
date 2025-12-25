
const express = require('express');
const router = express.Router();
const partenairesController = require('../controllers/partenaires.controller');

router.get('/', partenairesController.getAll);
router.get('/categories', partenairesController.getCategoriesWithPartenaires);
router.get('/categorie/:categorieId', partenairesController.getByCategorie);
router.get('/:id', partenairesController.getById);

// ✅ **إضافة middleware لرفع الملفات**
router.post('/', 
    partenairesController.upload, // معالجة رفع الملف
    partenairesController.create
);

router.put('/:id', 
    partenairesController.upload, // معالجة رفع الملف
    partenairesController.update
);

router.delete('/:id', partenairesController.delete);

module.exports = router;
