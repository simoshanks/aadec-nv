// models/Actualite.js
const db = require("../config/database");

const ActualiteModel = {
getAll: async (showAll = false) => {
  let sql = "SELECT * FROM actualites";

  if (!showAll) {
    sql += " WHERE is_published = 1";
  }

  sql += " ORDER BY date_publication DESC";

  const [rows] = await db.query(sql);
  return rows;
},


  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM actualites WHERE id=? LIMIT 1", [id]);
    return rows[0];
  },

  create: async (data) => {
    const { titre, slug, resume, contenu, image, categorie, is_published, date_publication } = data;
    const [result] = await db.query(
      `INSERT INTO actualites (titre, slug, resume, contenu, image, categorie, is_published, date_publication)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [titre, slug, resume, contenu, image, categorie, is_published || 0, date_publication || null]
    );
    return result;
  },

  update: async (id, data) => {
    const { titre, slug, resume, contenu, image, categorie, is_published, date_publication } = data;
    const [result] = await db.query(
      `UPDATE actualites SET titre=?, slug=?, resume=?, contenu=?, image=?, categorie=?, is_published=?, date_publication=? WHERE id=?`,
      [titre, slug, resume, contenu, image, categorie, is_published || 0, date_publication || null, id]
    );
    return result;
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM actualites WHERE id=?", [id]);
    return result;
  },
};

module.exports = ActualiteModel;
