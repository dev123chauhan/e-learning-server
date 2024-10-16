const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const path = require('path');
const upload = require('../middleware/upload');
// Registration Route
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();
    res.status(201).json('User registered!');
  } catch (error) {
    res.status(400).json('Error: ' + error);
  } 
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json('Invalid credentials');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '365d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

// Get User Data Route
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});


// Change password
router.post('/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: 'Password changed successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.post('/upload-profile-picture', authMiddleware, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file selected!' });
    }

    // Extract the filename using path.basename
    const filename = path.basename(req.file.path);

    User.findByIdAndUpdate(req.user.id, { profileImage: filename }, { new: true })
      .then(user => res.json({ success: true, user }))
      .catch(err => res.status(400).json({ success: false, message: err.message }));
  });
});
router.post('/update-profile', authMiddleware, async (req, res) => {
  try {
    const { gender, mobileNumber, dateOfBirth, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { gender, mobileNumber, dateOfBirth, address },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});
// Get user profile
// router.get('/:userId', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId)
//       .populate('enrolledCourses')
//       .populate('coursesTaught');
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// Update user profile
// router.patch('/:userId', async (req, res) => {
//   try {
//     const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
//     res.json(updatedUser);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });


module.exports = router;
