const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importation des routes
const adminRoutes = require('./routes/admin.routes');
const categoriesRoutes = require('./routes/categoriesPartenaires.routes');
const partenairesRoutes = require('./routes/partenaires.routes');
const domainRoutes = require('./routes/domain.routes');
const projectsRoutes = require('./routes/projects.routes');
const galleryRoutes = require('./routes/gallery.routes');
const documentsRoutes = require('./routes/documents.routes');
const actualitesRoutes = require('./routes/actualitesRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/partenaires', partenairesRoutes);
app.use('/api/domain', domainRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/documents', documentsRoutes);

app.use("/api/actualites", actualitesRoutes);



// Page d'accueil
app.get('/', (req, res) => {
    res.json({ 
        message: 'Bienvenue dans le système de gestion de l’association AADEC',
        version: '1.0.0'
    });
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ error: 'Page non trouvée' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Une erreur est survenue sur le serveur' });
});

const PORT = process.env.PORT ;

app.listen(PORT, () => {
    console.log(`Le serveur fonctionne sur le port ${PORT}`);
    console.log(`URL : http://localhost:${PORT}`);
});
