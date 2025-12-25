const db = require('../config/database');

class CategoriePartenaire {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM categories_partenaires ORDER BY id');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM categories_partenaires WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(titre, description) {
        const [result] = await db.query(
            'INSERT INTO categories_partenaires (titre, description) VALUES (?, ?)',
            [titre, description]
        );
        return result.insertId;
    }

    static async update(id, titre, description) {
        await db.query(
            'UPDATE categories_partenaires SET titre = ?, description = ? WHERE id = ?',
            [titre, description, id]
        );
        return true;
    }

    static async delete(id) {
        await db.query('DELETE FROM categories_partenaires WHERE id = ?', [id]);
        return true;
    }
}

module.exports = CategoriePartenaire;