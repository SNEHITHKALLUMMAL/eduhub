const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Please add a description'],
    },

    fileUrl: {
      type: String,
      default: '',
    },

    youtubeUrl: {
      type: String,
      default: '',
    },

    type: {
      type: String,
      required: [true, 'Please specify material type (file or youtube)'],
      enum: ['file', 'youtube'],
    },

    fileType: {
      type: String, // pdf, docx, ppt, etc.
      default: '',
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Material', materialSchema);