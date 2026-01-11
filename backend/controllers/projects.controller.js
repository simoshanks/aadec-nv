const Project = require('../models/projects.model');

/* GET ALL */
exports.getAll = async (req, res) => {
    try {
        const projects = await Project.findAll();
        res.json(projects);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

/* GET BY DOMAIN */
exports.getByDomain = async (req, res) => {
    try {
        const projects = await Project.findByDomain(req.params.domainId);
        res.json(projects);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

/* GET BY ID */
exports.getById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Projet introuvable' });
        }
        res.json(project);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

/* CREATE */
exports.create = async (req, res) => {
    try {
        const {
            domain_id,
            titre,
            description,
            partenaire,
            date_deb,
            date_fin,
            statut = 'en_cours'
        } = req.body;

        if (!titre || !domain_id) {
            return res.status(400).json({
                error: 'Le titre du projet et le domaine sont obligatoires'
            });
        }

        const photo = req.file
            ? `/uploads/projects/${req.file.filename}`
            : null;

        const id = await Project.create(
            domain_id,
            titre,
            description,
            partenaire,
            date_deb,
            date_fin,
            statut,
            photo
        );

        res.status(201).json({
            message: 'Projet créé avec succès',
            id
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

/* UPDATE - تم التصحيح هنا */
exports.update = async (req, res) => {
    try {
        const {
            domain_id,
            titre,
            description,
            partenaire,
            date_deb,
            date_fin,
            statut,
            photo: oldPhoto
        } = req.body;

        if (!titre || !domain_id) {
            return res.status(400).json({
                error: 'Le titre du projet et le domaine sont obligatoires'
            });
        }

        // ✅ الصورة: جديدة أو القديمة
        const photo = req.file
            ? `/uploads/projects/${req.file.filename}`
            : oldPhoto;

        await Project.update(
            req.params.id,
            domain_id,
            titre,
            description,
            partenaire,
            date_deb,
            date_fin,
            statut,
            photo
        );

        res.json({ message: 'Projet mis à jour avec succès' });
    } catch (e) {
        console.error('UPDATE PROJECT ERROR:', e);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};



/* DELETE */
exports.delete = async (req, res) => {
    try {
        await Project.delete(req.params.id);
        res.json({ message: 'Projet supprimé avec succès' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};