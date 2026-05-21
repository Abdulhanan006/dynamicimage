const express = require('express');
const router = express.Router();
const { getGallery, searchGallery } = require('../controllers/galleryController');

// @route   GET /gallery/search
// Needs to be before /gallery to prevent 'search' being treated as an ID if we had a /:id route
router.route('/search').get(searchGallery);

// @route   GET /gallery
router.route('/').get(getGallery);

module.exports = router;
