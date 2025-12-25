
const db = require('./config/database');
const bcrypt = require('bcryptjs');

async function encryptExistingPassword() {
    try {
        console.log(' Début du chiffrement...');
        
        
        const [admins] = await db.query('SELECT * FROM admin');
        
        console.log(` Nombre des admins: ${admins.length}`);
        
        for (const admin of admins) {
            console.log(`Traitement: ${admin.email}`);
            
            
            if (admin.password === '123456') {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(admin.password, salt);
                
                await db.query(
                    'UPDATE admin SET password = ? WHERE id = ?',
                    [hashedPassword, admin.id]
                );
                
                console.log(` ${admin.email}: 123456 -> [chiffré]`);
            } else {
                console.log(`  ${admin.email}: déjà chiffré`);
            }
        }
        
        console.log('Chiffrement terminé');
        console.log(' Connectez-vous avec: email: aadec2000@hotmail.com');
        
    } catch (error) {
        console.error(' Erreur:', error);
    }
}

encryptExistingPassword();