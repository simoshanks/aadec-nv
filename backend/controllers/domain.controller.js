const Domain = require('../models/domain.model');

exports.getAll = async (req, res) => {
    try {
        const domains = await Domain.findAll();
        res.json(domains);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getById = async (req, res) => {
    try {
        const domain = await Domain.findById(req.params.id);
        if (!domain) {
            return res.status(404).json({ error: 'Domaine introuvable' });
        }
        res.json(domain);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.create = async (req, res) => {
    try {
        const { nom, description } = req.body;
        
        if (!nom) {
            return res.status(400).json({ error: 'Le nom du domaine est obligatoire' });
        }

        const id = await Domain.create(nom, description);
        res.status(201).json({ 
            message: 'Domaine créé avec succès', 
            id 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.update = async (req, res) => {
    try {
        const { nom, description } = req.body;
        
        if (!nom) {
            return res.status(400).json({ error: 'Le nom du domaine est obligatoire' });
        }

        await Domain.update(req.params.id, nom, description);
        res.json({ message: 'Domaine mis à jour avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.delete = async (req, res) => {
    try {
        await Domain.delete(req.params.id);
        res.json({ message: 'Domaine supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
