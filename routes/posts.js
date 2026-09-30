const express = require('express');
const mongoose = require('mongoose');
const { Readable } = require('stream');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');

// Helper function to stream buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'the-data-hub' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};

// GET /posts - Retrieve all posts populated with author details
router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find().populate('author', 'name email');
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

// GET /posts/recent - Top 3 most recent posts
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

// GET /posts/:id - Retrieve a single post by ID
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

// POST /posts - Create a new post (supports optional image upload)
router.post('/', (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
    // 1. Handle Multer file upload errors (size limit or invalid file format)
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { title, content, author } = req.body;

      // 2. Validate required text fields
      if (!title || typeof title !== 'string' || !title.trim() || !content || typeof content !== 'string' || !content.trim()) {
        return res.status(400).json({ message: 'Title and content are required.' });
      }

      // 3. Validate author if provided
      if (author) {
        if (!mongoose.Types.ObjectId.isValid(author)) {
          return res.status(400).json({ message: 'Invalid author ID format' });
        }
        const userExists = await User.findById(author);
        if (!userExists) {
          return res.status(404).json({ message: 'Author user not found' });
        }
      }

      // 4. Handle Cloudinary image upload if a file was attached
      let imageUrl = null;
      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        imageUrl = uploadResult.secure_url;
      }

      // 5. Persist the document in MongoDB
      const newPost = await Post.create({
        title: title.trim(),
        content: content.trim(),
        author: author || undefined,
        imageUrl: imageUrl
      });

      const populatedPost = await Post.findById(newPost._id).populate('author', 'name email');
      return res.status(201).json(populatedPost);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message || 'Failed to create post' });
    }
  });
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

// DELETE /posts/:id - Delete a post by ID
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