const express = require('express');
const router = express.Router();

// GET /posts - Scaffold for post listing
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'GET /posts route active'
  });
});

// GET /posts/:id - Scaffold for single post retrieval
router.get('/:id', (req, res) => {
  res.status(200).json({
    message: 'GET /posts/:id route active',
    id: req.params.id
  });
});

// POST /posts - Scaffold for post creation
router.post('/', (req, res) => {
  res.status(201).json({
    message: 'POST /posts route active'
  });
});

// PUT /posts/:id - Scaffold for post update
router.put('/:id', (req, res) => {
  res.status(200).json({
    message: 'PUT /posts/:id route active',
    id: req.params.id
  });
});

// DELETE /posts/:id - Scaffold for post deletion
router.delete('/:id', (req, res) => {
  res.status(200).json({
    message: 'DELETE /posts/:id route active',
    id: req.params.id
  });
});

module.exports = router;