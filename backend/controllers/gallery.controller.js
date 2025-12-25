const Gallery = require('../models/gallery.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/gallery';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Type de fichier non pris en charge'));
        }
    }
}).single('image');

exports.uploadImage = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Une image doit être téléchargée' });
        }

        try {
            const { project_id } = req.body;
            
            if (!project_id) {
                // Supprimer le fichier téléchargé en cas d'erreur
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ error: 'project_id est obligatoire' });
            }

            const imagePath = req.file.filename;
            const id = await Gallery.create(project_id, imagePath);
            
            res.status(201).json({ 
                message: 'Image téléchargée avec succès', 
                id, 
                image: imagePath 
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });
};

exports.getByProject = async (req, res) => {
    try {
        const images = await Gallery.findByProject(req.params.projectId);
        res.json(images);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.delete = async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);
        
        if (!image) {
            return res.status(404).json({ error: 'Image introuvable' });
        }

        // Supprimer le fichier du serveur
        const filePath = path.join('uploads/gallery', image.image);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Supprimer de la base de données
        await Gallery.delete(req.params.id);
        
        res.json({ message: 'Image supprimée avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
