const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  getMaterials,
  createMaterial,
  deleteMaterial,
  updateMaterial
} = require('../controllers/materialController');

const { protect, admin } = require('../middleware/auth');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx|ppt|pptx/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(
        new Error('Only PDF, DOC, DOCX, PPT, and PPTX files are allowed!'),
        false
      );
    }
  },
});

// Get all materials + Create new material
router.route('/')
  .get(protect, getMaterials)
  .post(protect, admin, upload.single('file'), createMaterial);

// Update + Delete material by ID
router.route('/:id')
  .put(protect, admin, upload.single('file'), updateMaterial) // NEW EDIT FEATURE
  .delete(protect, admin, deleteMaterial);

module.exports = router;