const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = require('../models/Post');

// GET /posts - Retrieve all posts from MongoDB
router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

// GET /posts/:id - Retrieve a single post by MongoDB ObjectId
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post ID format' });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

// POST /posts - Create a new post in MongoDB
router.post('/', async (req, res, next) => {
  try {
    const { title, content } = req.body;

    // Validate input fields
    if (!title || typeof title !== 'string' || !title.trim() || !content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const newPost = await Post.create({
      title: title.trim(),
      content: content.trim()
    });

    res.status(201).json(newPost);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

// PUT /posts/:id - Update an existing post in MongoDB
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post ID format' });
    }

    const { title, content } = req.body;

    // Validate input fields
    if (!title || typeof title !== 'string' || !title.trim() || !content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title: title.trim(), content: content.trim() },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

// DELETE /posts/:id - Remove a post from MongoDB
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post ID format' });
    }

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;