const express = require('express');

const router = express.Router();

const passport = require('passport');

// Google /get google auth
router.get('/google',passport.authenticate('google', {scope:['profile']}))

// Google /get callback
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/'}),
    (req,res) =>{
    res.redirect('/dashboard')
})

// Logout user /auth/logout
router.get('/logout',(req,res) =>{
    req.logOut();
    res.redirect('/');
})

module.exports = router;