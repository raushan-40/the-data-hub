const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /users - Create a user for relationship testing
router.post('/', async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || typeof name !== 'string' || !name.trim() || !email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase()
    });

    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists.' });
    }
    next(error);
  }
});

// GET /users - List users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = router;