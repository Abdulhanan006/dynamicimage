const Gallery = require('../models/Gallery');

// @desc    Get all gallery images or filter by category/search title
// @route   GET /gallery
// @access  Public
const getGallery = async (req, res) => {
  try {
    const { category, title } = req.query;
    
    // Build query object
    let query = {};
    
    if (category && category.toLowerCase() !== 'all') {
      query.category = category;
    }
    
    if (title) {
      // Use regex for partial, case-insensitive match
      query.title = { $regex: title, $options: 'i' };
    }

    const images = await Gallery.find(query).sort({ created_at: -1 });
    
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Search gallery images by title
// @route   GET /gallery/search
// @access  Public
const searchGallery = async (req, res) => {
  try {
    const { title } = req.query;
    
    if (!title) {
      return res.status(400).json({ message: 'Please provide a search title' });
    }

    const images = await Gallery.find({
      title: { $regex: title, $options: 'i' }
    }).sort({ created_at: -1 });

    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getGallery,
  searchGallery,
};
