const express = require('express');
const router = express.Router();

// In-memory data store for blog posts
let blogPosts = [];
let nextId = 1;

// GET /posts - Retrieve all posts
router.get('/', (req, res) => {
  res.status(200).json(blogPosts);
});

// GET /posts/:id - Retrieve a single post by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({
      message: 'Post not found'
    });
  }

  res.status(200).json(post);
});

// POST /posts - Create a new post
router.post('/', (req, res) => {
  const { title, body } = req.body;

  // Validation: both title and body are required non-empty strings
  if (!title || typeof title !== 'string' || !title.trim() || !body || typeof body !== 'string' || !body.trim()) {
    return res.status(400).json({
      message: 'Title and body are required.'
    });
  }

  const newPost = {
    id: nextId++,
    title: title.trim(),
    body: body.trim(),
    createdAt: new Date().toISOString()
  };

  blogPosts.push(newPost);
  res.status(201).json(newPost);
});

// PUT /posts/:id - Update an existing post by ID
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const postIndex = blogPosts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return res.status(404).json({
      message: 'Post not found'
    });
  }

  const { title, body } = req.body;

  // Validation: both title and body are required non-empty strings
  if (!title || typeof title !== 'string' || !title.trim() || !body || typeof body !== 'string' || !body.trim()) {
    return res.status(400).json({
      message: 'Title and body are required.'
    });
  }

  blogPosts[postIndex] = {
    ...blogPosts[postIndex],
    title: title.trim(),
    body: body.trim()
  };

  res.status(200).json(blogPosts[postIndex]);
});

// DELETE /posts/:id - Delete a post by ID
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const postIndex = blogPosts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return res.status(404).json({
      message: 'Post not found'
    });
  }

  blogPosts.splice(postIndex, 1);
  res.status(200).json({
    message: 'Post deleted successfully'
  });
});

module.exports = router;