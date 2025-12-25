const Admin = require('../models/admin.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const admin = await Admin.findByEmail(email);
        if (!admin) {
            return res.status(401).json({ error: 'Informations incorrectes' });
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Informations incorrectes' });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ 
            token, 
            admin: { 
                id: admin.id, 
                email: admin.email 
            } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const { id } = req.user; 

        const admin = await Admin.findByEmail(req.user.email);
        
        
        const isValid = await bcrypt.compare(currentPassword, admin.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
        }

        
        await Admin.updatePassword(id, newPassword);
        
        res.json({ message: 'Mot de passe changé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};