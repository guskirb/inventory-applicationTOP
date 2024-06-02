const express = require('express');
const router = express.Router();

const album_controller = require('../controllers/albumController');
const artist_controller = require('../controllers/artistController');
const format_controller = require('../controllers/formatController');
const genre_controller = require('../controllers/genreController');
const label_controller = require('../controllers/labelController');
const index_controller = require('../controllers/indexController');

// Homepage route
router.get('/', index_controller.index);

// Album routes
router.get('/albums', album_controller.album_list);

// Artist routes
router.get('/artists', artist_controller.artist_list);

// Format routes
router.get('/releases', format_controller.format_list);

// Genre list
router.get('/genres', genre_controller.genre_list);

// Label routes
router.get('/labels', label_controller.label_list);

module.exports = router;