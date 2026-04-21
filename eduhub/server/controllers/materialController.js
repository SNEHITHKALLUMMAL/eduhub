const Material = require('../models/Material');
const fs = require('fs');
const path = require('path');

// @desc    Get all materials
// @route   GET /api/materials
// @access  Private
const getMaterials = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const materials = await Material.find(query).sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new material
// @route   POST /api/materials
// @access  Private/Admin
const createMaterial = async (req, res) => {
  const { title, description, youtubeUrl, type } = req.body;

  if (!title || !description || !type) {
    return res.status(400).json({ message: 'Please add all required fields' });
  }

  let fileUrl = '';
  let fileType = '';

  if (type === 'file') {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file for type "file"' });
    }
    fileUrl = `/uploads/${req.file.filename}`;
    fileType = path.extname(req.file.originalname).substring(1);
  }

  try {
    const material = await Material.create({
      title,
      description,
      fileUrl,
      youtubeUrl: type === 'youtube' ? youtubeUrl : '',
      type,
      fileType,
      uploadedBy: req.user._id,
    });

    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete material
// @route   DELETE /api/materials/:id
// @access  Private/Admin
const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Delete file from server if it exists
    if (material.type === 'file' && material.fileUrl) {
      const filePath = path.join(__dirname, '..', material.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await material.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMaterials,
  createMaterial,
  deleteMaterial,
};
