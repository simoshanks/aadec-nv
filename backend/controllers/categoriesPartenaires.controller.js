const CategoriePartenaire = require('../models/categoriesPartenaires.model');

exports.getAll = async (req, res) => {
    try {
        const categories = await CategoriePartenaire.findAll();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getById = async (req, res) => {
    try {
        const categorie = await CategoriePartenaire.findById(req.params.id);
        if (!categorie) {
            return res.status(404).json({ error: 'Catégorie introuvable' });
        }
        res.json(categorie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.create = async (req, res) => {
    try {
        const { titre, description } = req.body;
        
        if (!titre) {
            return res.status(400).json({ error: 'Le titre est obligatoire' });
        }

        const id = await CategoriePartenaire.create(titre, description);
        res.status(201).json({ 
            message: 'Catégorie créée avec succès', 
            id 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.update = async (req, res) => {
    try {
        const { titre, description } = req.body;
        
        if (!titre) {
            return res.status(400).json({ error: 'Le titre est obligatoire' });
        }

        await CategoriePartenaire.update(req.params.id, titre, description);
        res.json({ message: 'Catégorie mise à jour avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.delete = async (req, res) => {
    try {
        await CategoriePartenaire.delete(req.params.id);
        res.json({ message: 'Catégorie supprimée avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
