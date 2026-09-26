const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// GET /posts - Retrieve all posts populated with author details
router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find().populate('author', 'name email');
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

// GET /posts/recent - Retrieve the top 3 most recent posts sorted by createdAt descending
router.get('/recent', async (req, res, next) => {
  try {
    const recentPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('author', 'name email');

    res.status(200).json(recentPosts);
  } catch (error) {
    next(error);
  }
});

// GET /posts/:id - Retrieve a single post by ID with populated author
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post ID format' });
    }

    const post = await Post.findById(id).populate('author', 'name email');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

// POST /posts - Create a new post with optional/validated User author reference
router.post('/', async (req, res, next) => {
  try {
    const { title, content, author } = req.body;

    if (!title || typeof title !== 'string' || !title.trim() || !content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    // If author is provided, validate ID format and check User existence
    if (author) {
      if (!mongoose.Types.ObjectId.isValid(author)) {
        return res.status(400).json({ message: 'Invalid author ID format' });
      }

      const userExists = await User.findById(author);
      if (!userExists) {
        return res.status(404).json({ message: 'Author user not found' });
      }
    }

    const newPost = await Post.create({
      title: title.trim(),
      content: content.trim(),
      author: author || undefined
    });

    const populatedPost = await Post.findById(newPost._id).populate('author', 'name email');
    res.status(201).json(populatedPost);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

// PUT /posts/:id - Update an existing post
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post ID format' });
    }

    const { title, content, author } = req.body;

    if (!title || typeof title !== 'string' || !title.trim() || !content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const updateData = {
      title: title.trim(),
      content: content.trim()
    };

    if (author !== undefined) {
      if (author !== null && !mongoose.Types.ObjectId.isValid(author)) {
        return res.status(400).json({ message: 'Invalid author ID format' });
      }
      if (author !== null) {
        const userExists = await User.findById(author);
        if (!userExists) {
          return res.status(404).json({ message: 'Author user not found' });
        }
      }
      updateData.author = author;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name email');

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

// DELETE /posts/:id - Remove a post by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

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