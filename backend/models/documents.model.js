const db = require('../config/database');

class Document {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM documents ORDER BY id DESC');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM documents WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(title, description, doc_date, size, url) {
        const [result] = await db.query(
            'INSERT INTO documents (title, description, doc_date, size, url) VALUES (?, ?, ?, ?, ?)',
            [title, description, doc_date, size, url]
        );
        return result.insertId;
    }

    static async update(id, title, description, doc_date, size, url) {
        await db.query(
            'UPDATE documents SET title = ?, description = ?, doc_date = ?, size = ?, url = ? WHERE id = ?',
            [title, description, doc_date, size, url, id]
        );
        return true;
    }

    static async delete(id) {
        await db.query('DELETE FROM documents WHERE id = ?', [id]);
        return true;
    }
}

module.exports = Document;