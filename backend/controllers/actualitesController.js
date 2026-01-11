const ActualiteModel = require("../models/Actualite");
const slugify = require("slugify");

const getActualites = async (req, res) => {
  try {
    const showAll = req.query.showAll === "true";
    const actualites = await ActualiteModel.getAll(showAll);
    res.json(actualites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


const getActualiteById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const actualite = await ActualiteModel.getById(id);
    if (!actualite) return res.status(404).json({ message: "Actualité introuvable" });
    res.json(actualite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const createActualite = async (req, res) => {
  try {
    const data = { ...req.body };

    // توليد slug تلقائي
    if (data.titre) {
      data.slug = slugify(data.titre, { lower: true, strict: true });
    }

    // إذا رفعو image
    if (req.file) {
      data.image = req.file.filename;
    }

    const actualite = await ActualiteModel.create(data);
    res.status(201).json({ message: "Actualité créée", id: actualite.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const updateActualite = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // جيب المقال القديم
    const oldActualite = await ActualiteModel.getById(id);
    if (!oldActualite) {
      return res.status(404).json({ message: "Actualité introuvable" });
    }

    const data = { ...req.body };

    // slug إلا تبدل العنوان
    if (data.titre) {
      data.slug = slugify(data.titre, { lower: true, strict: true });
    }

    // 🟢 image logic الصحيح
    if (req.file) {
      data.image = req.file.filename; // image جديدة
    } else {
      data.image = oldActualite.image; // خليه القديمة
    }

    await ActualiteModel.update(id, data);

    res.json({ message: "Actualité mise à jour" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};




const deleteActualite = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await ActualiteModel.delete(id);
    res.json({ message: "Actualité supprimée" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getActualites,
  getActualiteById,
  createActualite,
  updateActualite,
  deleteActualite,
};
