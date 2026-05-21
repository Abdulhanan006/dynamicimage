const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  image_url: {
    type: String,
    required: [true, 'Please add an image URL'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Web Design', 'Mobile Apps', 'AI Projects', 'Python Projects', 'Other'],
    default: 'Other'
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Gallery', gallerySchema);
