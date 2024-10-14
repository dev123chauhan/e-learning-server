const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');



// Configure Passport
passport.use(new GoogleStrategy({
    clientID: 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: "http://localhost:8000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // Here you would typically find or create a user in your database
    // For this example, we'll just use the Google profile
    return cb(null, profile);
  }
));

router.use(passport.initialize());

// Google authentication route
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google authentication callback
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Create a JWT token
    const token = jwt.sign({ id: req.user.id }, 'YOUR_JWT_SECRET', { expiresIn: '365d' });
    // Redirect to the frontend with the token
    res.redirect(`http://localhost:3000/login?token=${token}`);
  });

// Endpoint to verify Google token from frontend
router.post('/auth/google', async (req, res) => {
  const { token } = req.body;
  try {
    // Verify the Google token (you may want to use the google-auth-library for this)
    // For simplicity, we're just creating a new token here
    const newToken = jwt.sign({ id: 'google_user_id' }, 'YOUR_JWT_SECRET', { expiresIn: '365d' });
    res.json({ token: newToken });
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
});

module.exports = router;