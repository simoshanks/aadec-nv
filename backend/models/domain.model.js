const db = require('../config/database');

class Domain {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM domain ORDER BY id');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM domain WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(nom, description) {
        const [result] = await db.query(
            'INSERT INTO domain (nom,) VALUES (?)',
            [nom, ]
        );
        return result.insertId;
    }

    static async update(id, nom) {
        await db.query(
            'UPDATE domain SET nom = ? WHERE id = ?',
            [nom, id]
        );
        return true;
    }

    static async delete(id) {
        await db.query('DELETE FROM domain WHERE id = ?', [id]);
        return true;
    }
}

module.exports = Domain;