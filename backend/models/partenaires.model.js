
const db = require('../config/database');

class Partenaire {
    static async findAll() {
        const [rows] = await db.query(`
            SELECT p.*, cp.titre as categorie_titre 
            FROM partenaires p 
            LEFT JOIN categories_partenaires cp ON p.categorie_id = cp.id 
            ORDER BY p.id
        `);
        return rows;
    }

    static async findByCategorie(categorieId) {
        const [rows] = await db.query(
            'SELECT * FROM partenaires WHERE categorie_id = ? ORDER BY nom',
            [categorieId]
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM partenaires WHERE id = ?', [id]);
        return rows[0];
    }

    // ✅ **تمت الإضافة: دالة جديدة للحصول على جميع الفئات مع الشركاء**
    static async findAllCategoriesWithPartenaires() {
        const [rows] = await db.query(`
            SELECT 
                c.id AS categorie_id,
                c.titre,
                c.description,
                p.id AS partenaire_id,
                p.nom,
                p.logo
            FROM categories_partenaires c
            LEFT JOIN partenaires p ON p.categorie_id = c.id
            ORDER BY c.id
        `);
        return rows;
    }

    static async create(categorie_id, nom, logo) {
        const [result] = await db.query(
            'INSERT INTO partenaires (categorie_id, nom, logo) VALUES (?, ?, ?)',
            [categorie_id, nom, logo]
        );
        return result.insertId;
    }

    static async update(id, categorie_id, nom, logo) {
        await db.query(
            'UPDATE partenaires SET categorie_id = ?, nom = ?, logo = ? WHERE id = ?',
            [categorie_id, nom, logo, id]
        );
        return true;
    }

    static async delete(id) {
        await db.query('DELETE FROM partenaires WHERE id = ?', [id]);
        return true;
    }
}

module.exports = Partenaire;
