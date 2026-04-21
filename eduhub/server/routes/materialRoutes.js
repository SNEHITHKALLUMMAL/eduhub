const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getMaterials, createMaterial, deleteMaterial } = require('../controllers/materialController');
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
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and PPT files are allowed!'), false);
    }
  },
});

router.route('/')
  .get(protect, getMaterials)
  .post(protect, admin, upload.single('file'), createMaterial);

router.route('/:id')
  .delete(protect, admin, deleteMaterial);

module.exports = router;
