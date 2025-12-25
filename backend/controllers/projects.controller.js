const Project = require('../models/projects.model');

exports.getAll = async (req, res) => {
    try {
        const projects = await Project.findAll();
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getByDomain = async (req, res) => {
    try {
        const projects = await Project.findByDomain(req.params.domainId);
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Projet introuvable' });
        }
        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

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

        const id = await Project.create(
            domain_id, 
            titre, 
            description, 
            partenaire, 
            date_deb, 
            date_fin, 
            statut
        );
        res.status(201).json({ 
            message: 'Projet créé avec succès', 
            id 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.update = async (req, res) => {
    try {
        const { 
            domain_id, 
            titre, 
            description, 
            partenaire, 
            date_deb, 
            date_fin, 
            statut 
        } = req.body;
        
        if (!titre || !domain_id) {
            return res.status(400).json({ 
                error: 'Le titre du projet et le domaine sont obligatoires' 
            });
        }

        await Project.update(
            req.params.id, 
            domain_id, 
            titre, 
            description, 
            partenaire, 
            date_deb, 
            date_fin, 
            statut
        );
        res.json({ message: 'Projet mis à jour avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.delete = async (req, res) => {
    try {
        await Project.delete(req.params.id);
        res.json({ message: 'Projet supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
