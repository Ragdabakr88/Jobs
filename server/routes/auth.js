
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const { authMiddleware } = require('../helpers/auth');
const passport = require('passport');
const passportConfig = require('../config/passport-google');




/* google ROUTE */
// router.get('/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login']}));
router.get('/google', passport.authenticate('google', { scope: ['profile','email'] ,}));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failure'}), (req,res) =>{
//   res.json({msg :'authnticated'});
const token = jwt.sign({id:req.user},config.SECRET, {
    expiresIn:'1d',
});
// res.json(token);
res.redirect(`http://localhost:4200/posts/?token=${token}`);
 });

router.get('/failure' , (req,res) => res.redirect('http://localhost:4200/users/login'));

module.exports = router;



