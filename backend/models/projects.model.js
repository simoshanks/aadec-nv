const db = require('../config/database');

class Project {
    static async findAll() {
        const [rows] = await db.query(`
            SELECT p.*, d.nom as domain_nom 
            FROM projects p
            LEFT JOIN domain d ON p.domain_id = d.id
            ORDER BY p.id DESC
        `);
        return rows;
    }

    static async findByDomain(domainId) {
        const [rows] = await db.query(`
            SELECT p.*, d.nom as domain_nom
            FROM projects p
            LEFT JOIN domain d ON p.domain_id = d.id
            WHERE p.domain_id = ?
            ORDER BY p.date_deb DESC
        `, [domainId]);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(
            'SELECT * FROM projects WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async create(
        domain_id,
        titre,
        description,
        partenaire,
        date_deb,
        date_fin,
        statut,
        photo
    ) {
        const [result] = await db.query(
            `INSERT INTO projects
            (domain_id, titre, description, partenaire, date_deb, date_fin, statut, photo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [domain_id, titre, description, partenaire, date_deb, date_fin, statut, photo]
        );
        return result.insertId;
    }

    static async update(
        id,
        domain_id,
        titre,
        description,
        partenaire,
        date_deb,
        date_fin,
        statut,
        photo
    ) {
        await db.query(
            `UPDATE projects
             SET domain_id = ?, titre = ?, description = ?, partenaire = ?,
                 date_deb = ?, date_fin = ?, statut = ?, photo = ?
             WHERE id = ?`,
            [domain_id, titre, description, partenaire, date_deb, date_fin, statut, photo, id]
        );
        return true;
    }

    static async delete(id) {
        await db.query('DELETE FROM projects WHERE id = ?', [id]);
        return true;
    }
}

module.exports = Project;
