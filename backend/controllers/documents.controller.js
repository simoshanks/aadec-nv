const Document = require('../models/documents.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/documents';
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
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx|txt|zip|rar/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        
        if (extname) {
            return cb(null, true);
        } else {
            cb(new Error('Type de fichier non pris en charge'));
        }
    }
}).single('file');

exports.uploadDocument = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Un fichier doit être téléchargé' });
        }

        try {
            const { title, description, doc_date } = req.body;
            
            if (!title) {
                // Supprimer le fichier téléchargé en cas d'erreur
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ error: 'Le titre du document est obligatoire' });
            }

            const size = (req.file.size / (1024 * 1024)).toFixed(2) + ' MB';
            const url = '/uploads/documents/' + req.file.filename;
            
            const id = await Document.create(
                title, 
                description, 
                doc_date, 
                size, 
                url
            );
            
            res.status(201).json({ 
                message: 'Document téléchargé avec succès', 
                id, 
                document: { 
                    title, 
                    url, 
                    size 
                } 
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });
};

exports.getAll = async (req, res) => {
    try {
        const documents = await Document.findAll();
        res.json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getById = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ error: 'Document introuvable' });
        }
        res.json(document);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.update = async (req, res) => {
    try {
        const { title, description, doc_date, size, url } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Le titre du document est obligatoire' });
        }

        await Document.update(req.params.id, title, description, doc_date, size, url);
        res.json({ message: 'Document mis à jour avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.delete = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        
        if (!document) {
            return res.status(404).json({ error: 'Document introuvable' });
        }

        // Supprimer le fichier du serveur s'il existe
        if (document.url.includes('/uploads/')) {
            const filename = path.basename(document.url);
            const filePath = path.join('uploads/documents', filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Supprimer de la base de données
        await Document.delete(req.params.id);
        
        res.json({ message: 'Document supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
