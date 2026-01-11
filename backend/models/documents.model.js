const db = require('../config/database');

class Document {
    static async findAll() {
        try {
            const [rows] = await db.query('SELECT * FROM documents ORDER BY id DESC');
            return rows;
        } catch (error) {
            console.error('Erreur findAll:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM documents WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('Erreur findById:', error);
            throw error;
        }
    }

    static async create(title, description, doc_date, size, url) {
        try {
            const [result] = await db.query(
                'INSERT INTO documents (title, description, doc_date, size, url) VALUES (?, ?, ?, ?, ?)',
                [title, description, doc_date, size, url]
            );
            return result.insertId;
        } catch (error) {
            console.error('Erreur create:', error);
            throw error;
        }
    }

    static async update(id, title, description, doc_date, size, url) {
        try {
            const [result] = await db.query(
                'UPDATE documents SET title = ?, description = ?, doc_date = ?, size = ?, url = ? WHERE id = ?',
                [title, description, doc_date, size, url, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erreur update:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.query('DELETE FROM documents WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erreur delete:', error);
            throw error;
        }
    }
}

module.exports = Document;