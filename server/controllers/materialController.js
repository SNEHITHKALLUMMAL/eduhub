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
    return res.status(400).json({
      message: 'Please add all required fields',
    });
  }

  let fileUrl = '';
  let fileType = '';

  if (type === 'file') {
    if (!req.file) {
      return res.status(400).json({
        message: 'Please upload a file for type "file"',
      });
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
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Update material
// @route   PUT /api/materials/:id
// @access  Private/Admin
const updateMaterial = async (req, res) => {
  try {
    const { title, description, type, youtubeUrl } = req.body;

    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        message: 'Material not found',
      });
    }

    // Update only changed basic values
    material.title = title || material.title;
    material.description = description || material.description;

    // Handle Type and File/YouTube URL changes
    if (type) {
      // If changing type to youtube, or updating an existing youtube material
      if (type === 'youtube') {
        // If it was a file before, delete the file from disk
        if (material.type === 'file' && material.fileUrl) {
          const filePath = path.join(__dirname, '..', material.fileUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        material.type = 'youtube';
        material.fileUrl = '';
        material.fileType = '';
        material.youtubeUrl = youtubeUrl || material.youtubeUrl;
      } 
      // If type is file
      else if (type === 'file') {
        material.type = 'file';
        material.youtubeUrl = '';
        
        // If a new file was uploaded
        if (req.file) {
          // Delete old file
          if (material.fileUrl) {
            const filePath = path.join(__dirname, '..', material.fileUrl);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
          material.fileUrl = `/uploads/${req.file.filename}`;
          material.fileType = path.extname(req.file.originalname).substring(1);
        }
      }
    } else {
      // If type isn't changing, but we uploaded a new file anyway
      if (req.file && material.type === 'file') {
        if (material.fileUrl) {
          const filePath = path.join(__dirname, '..', material.fileUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        material.fileUrl = `/uploads/${req.file.filename}`;
        material.fileType = path.extname(req.file.originalname).substring(1);
      } else if (material.type === 'youtube') {
         material.youtubeUrl = youtubeUrl !== undefined ? youtubeUrl : material.youtubeUrl;
      }
    }

    const updatedMaterial = await material.save();

    res.status(200).json(updatedMaterial);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Delete material
// @route   DELETE /api/materials/:id
// @access  Private/Admin
const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        message: 'Material not found',
      });
    }

    // Delete file from server if it exists
    if (material.type === 'file' && material.fileUrl) {
      const filePath = path.join(__dirname, '..', material.fileUrl);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await material.deleteOne();

    res.status(200).json({
      id: req.params.id,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
};