const db = require('../config/database');

class Gallery {
    static async findByProject(projectId) {
        const [rows] = await db.query(
            'SELECT * FROM gallery WHERE project_id = ? ORDER BY id',
            [projectId]
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM gallery WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(project_id, image) {
        const [result] = await db.query(
            'INSERT INTO gallery (project_id, image) VALUES (?, ?)',
            [project_id, image]
        );
        return result.insertId;
    }

    static async delete(id) {
        await db.query('DELETE FROM gallery WHERE id = ?', [id]);
        return true;
    }
}

module.exports = Gallery;