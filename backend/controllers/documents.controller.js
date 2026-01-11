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

// Configuration de multer pour le téléchargement
const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (extname) {
        return cb(null, true);
    } else {
        cb(new Error('Type de fichier non pris en charge'));
    }
};

// Middleware pour l'upload (ajout)
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: fileFilter
}).single('file');

// Middleware pour la mise à jour (modification)
const uploadForUpdate = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: fileFilter
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
                description || null, 
                doc_date || null, 
                size, 
                url
            );
            
            res.status(201).json({ 
                message: 'Document téléchargé avec succès', 
                id, 
                document: { 
                    id,
                    title, 
                    description: description || null,
                    doc_date: doc_date || null,
                    url, 
                    size 
                } 
            });
        } catch (error) {
            console.error('Erreur uploadDocument:', error);
            
            // Supprimer le fichier en cas d'erreur
            if (req.file && req.file.path) {
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            }
            
            res.status(500).json({ error: 'Erreur serveur lors du téléchargement' });
        }
    });
};

exports.getAll = async (req, res) => {
    try {
        const documents = await Document.findAll();
        res.json(documents);
    } catch (error) {
        console.error('Erreur getAll:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des documents' });
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
        console.error('Erreur getById:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.update = async (req, res) => {
    uploadForUpdate(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        try {
            const id = req.params.id;
            const existing = await Document.findById(id);

            if (!existing) {
                // Supprimer le fichier téléchargé si le document n'existe pas
                if (req.file && req.file.path) {
                    if (fs.existsSync(req.file.path)) {
                        fs.unlinkSync(req.file.path);
                    }
                }
                return res.status(404).json({ error: 'Document introuvable' });
            }

            const { title, description, doc_date } = req.body;
            
            // Garder les anciennes valeurs si non fournies
            const newTitle = title || existing.title;
            const newDescription = description !== undefined ? description : existing.description;
            const newDocDate = doc_date || existing.doc_date;
            
            let url = existing.url;
            let size = existing.size;

            // Si un nouveau fichier est uploadé
            if (req.file) {
                // Supprimer l'ancien fichier
                if (existing.url && existing.url.includes('/uploads/')) {
                    const filename = path.basename(existing.url);
                    const filePath = path.join('uploads/documents', filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
                
                url = '/uploads/documents/' + req.file.filename;
                size = (req.file.size / (1024 * 1024)).toFixed(2) + ' MB';
            }

            await Document.update(id, newTitle, newDescription, newDocDate, size, url);
            
            res.json({ 
                message: 'Document mis à jour avec succès',
                document: {
                    id,
                    title: newTitle,
                    description: newDescription,
                    doc_date: newDocDate,
                    size,
                    url
                }
            });
            
        } catch (error) {
            console.error('Erreur update:', error);
            
            // Supprimer le fichier uploadé en cas d'erreur
            if (req.file && req.file.path) {
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            }
            
            res.status(500).json({ error: 'Erreur serveur lors de la mise à jour' });
        }
    });
};

exports.delete = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        
        if (!document) {
            return res.status(404).json({ error: 'Document introuvable' });
        }

        // Supprimer le fichier du serveur s'il existe
        if (document.url && document.url.includes('/uploads/')) {
            const filename = path.basename(document.url);
            const filePath = path.join('uploads/documents', filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Supprimer de la base de données
        await Document.delete(req.params.id);
        
        res.json({ 
            message: 'Document supprimé avec succès',
            id: req.params.id
        });
    } catch (error) {
        console.error('Erreur delete:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la suppression' });
    }
};