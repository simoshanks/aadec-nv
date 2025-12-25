const db = require('../config/database');
const bcrypt = require('bcryptjs');  

class Admin {
    static async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM admin WHERE email = ?', [email]);
        return rows[0];
    }

    static async create(email, password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.query(
            'INSERT INTO admin (email, password) VALUES (?, ?)',
            [email, hashedPassword]  
        );
        return result.insertId;
    }

    
    static async updatePassword(id, newPassword) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        await db.query(
            'UPDATE admin SET password = ? WHERE id = ?',
            [hashedPassword, id]
        );
        return true;
    }
}

module.exports = Admin;