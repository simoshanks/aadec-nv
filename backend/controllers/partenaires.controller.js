
const Partenaire = require('../models/partenaires.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// إعدادات multer لتخزين الملفات
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/logos';
    // إنشاء المجلد إذا لم يكن موجوداً
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // إنشاء اسم فريد للملف
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// فلترة الملفات (الصور فقط)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|svg|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, svg, webp)'));
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB حد أقصى
  fileFilter: fileFilter
});

// ✅ **تصدير upload لاستخدامها في الـ routes**
exports.upload = upload.single('logo');

exports.getAll = async (req, res) => {
    try {
        const partenaires = await Partenaire.findAll();
        res.json(partenaires);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getCategoriesWithPartenaires = async (req, res) => {
  try {
    const rows = await Partenaire.findAllCategoriesWithPartenaires();
    
    const result = {};

    rows.forEach(row => {
      if (!result[row.categorie_id]) {
        result[row.categorie_id] = {
          id: row.categorie_id,
          titre: row.titre,
          description: row.description,
          partenaires: []
        };
      }

      if (row.partenaire_id) {
        result[row.categorie_id].partenaires.push({
          id: row.partenaire_id,
          nom: row.nom,
          logo: row.logo ? `/uploads/logos/${path.basename(row.logo)}` : null
        });
      }
    });

    res.json(Object.values(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ **تعديل دالة create لدعم رفع الملفات**
exports.create = async (req, res) => {
    try {
        const { categorie_id, nom } = req.body;
        
        if (!nom || !categorie_id) {
            // حذف الملف إذا تم رفعه وكانت البيانات غير مكتملة
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ 
                error: 'Le nom du partenaire et la catégorie sont obligatoires' 
            });
        }

        let logoPath = null;
        if (req.file) {
            // حفظ المسار النسبي للصورة
            logoPath = req.file.filename;
        }

        const id = await Partenaire.create(categorie_id, nom, logoPath);
        res.status(201).json({ 
            message: 'Partenaire créé avec succès', 
            id,
            logo: logoPath ? `/uploads/logos/${logoPath}` : null
        });
    } catch (error) {
        // حذف الملف إذا حدث خطأ
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ✅ **تعديل دالة update لدعم رفع الملفات**
exports.update = async (req, res) => {
    try {
        const { categorie_id, nom } = req.body;
        
        if (!nom || !categorie_id) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ 
                error: 'Le nom du partenaire et la catégorie sont obligatoires' 
            });
        }

        let logoPath = null;
        if (req.file) {
            logoPath = req.file.filename;
            
            // حذف الصورة القديمة إذا كانت موجودة
            const oldPartenaire = await Partenaire.findById(req.params.id);
            if (oldPartenaire && oldPartenaire.logo) {
                const oldPath = path.join('public/uploads/logos', oldPartenaire.logo);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }

        await Partenaire.update(req.params.id, categorie_id, nom, logoPath || req.body.logo);
        res.json({ 
            message: 'Partenaire mis à jour avec succès',
            logo: logoPath ? `/uploads/logos/${logoPath}` : null
        });
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.delete = async (req, res) => {
    try {
        // حذف الصورة المرفقة إذا كانت موجودة
        const partenaire = await Partenaire.findById(req.params.id);
        if (partenaire && partenaire.logo) {
            const logoPath = path.join('public/uploads/logos', partenaire.logo);
            if (fs.existsSync(logoPath)) {
                fs.unlinkSync(logoPath);
            }
        }
        
        await Partenaire.delete(req.params.id);
        res.json({ message: 'Partenaire supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getById = async (req, res) => {
    try {
        const partenaire = await Partenaire.findById(req.params.id);
        if (!partenaire) {
            return res.status(404).json({ error: 'Partenaire introuvable' });
        }
        
        // إضافة المسار الكامل للصورة
        if (partenaire.logo) {
            partenaire.logoUrl = `/uploads/logos/${partenaire.logo}`;
        }
        
        res.json(partenaire);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getByCategorie = async (req, res) => {
    try {
        const partenaires = await Partenaire.findByCategorie(req.params.categorieId);
        
        // إضافة المسار الكامل للصور
        const partenairesWithUrls = partenaires.map(p => ({
            ...p,
            logoUrl: p.logo ? `/uploads/logos/${p.logo}` : null
        }));
        
        res.json(partenairesWithUrls);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
