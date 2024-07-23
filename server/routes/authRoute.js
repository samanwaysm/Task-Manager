const express = require('express');
const route = express.Router();
const userController = require('../controller/userController');
const passport = require('passport'); 
require('../../passport');

route.use(passport.initialize()); 
route.use(passport.session());

// Auth 
route.get('/auth/google' , passport.authenticate('google', { scope: 
	[ 'email', 'profile' ] 
})); 

route.get( '/auth/google/callback', 
	passport.authenticate( 'google', { 
		successRedirect: '/auth/google/callback2', 
		failureRedirect: '/failure'
}));

// Auth Callback 
route.get('/auth/google/callback2', userController.googleAuth);


module.exports = route
