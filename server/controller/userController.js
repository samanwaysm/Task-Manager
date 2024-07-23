const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

var userDb = require("../model/userSchema");
var taskDb = require("../model/taskSchema");

exports.googleAuth = async (req, res) => {
    try {
        const { sub, email, name, given_name, family_name } = req.user;
        console.log(sub, email, name);
        // Check if the user already exists
        let user = await userDb.findOne({ email });

        if (!user) {
            user = new userDb({
                firstName: given_name,
                lastName: family_name,
                email,
                googleId: sub
            });

            await user.save();
        }

        req.session.email = email;
        req.session.userId = user._id;
        req.session.isUserAuthenticated = true;

        res.redirect('/')
    } catch (error) {
        res.status(400).json({ status: 'failure', message: 'Invalid token' });
    }
};

exports.registerUser = async (req,res)=>{
    try {
        const { firstName, lastName, email, password,confirmPassword } = req.body;
        let errors = {};

        // Validate input data
        if (!firstName) errors.firstName = 'First name is required';
        if (!lastName) errors.lastName = 'Last name is required';
        if (!email) {
            errors.email = 'Email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.email = 'Invalid email format';
            }
        }
        if (!password) errors.password = 'Password is required';
        if (!confirmPassword) errors.confirmPassword = 'Confirm password is required';
        if (password && password.length < 8) errors.password = 'Password must be at least 8 characters';
        if (password && confirmPassword && password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

        if (Object.keys(errors).length > 0) {
            req.session.errors = errors;
            return res.redirect('/register');
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userDb({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        // Save the user to the database
        await newUser.save();

        res.redirect('/login');
    } catch (error) {
        // Handle any errors
        console.log('error working');
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.loginUser = async (req,res)=>{
    try {
        const { email, password } = req.body;
        
        let errors = {};

        // Validate input data
        if (!email) errors.email = 'Email is required';
        if (!password) errors.password = 'Password is required';

        if (Object.keys(errors).length > 0) {
            req.session.errors = errors;
            return res.redirect('/login');
        }

        // Find the user by email
        const user = await userDb.findOne({ email });
        
        if (!user) {
            errors.general = 'Invalid email or password';
            req.session.errors = errors;
            return res.redirect('/login');
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            errors.general = 'Invalid email or password';
            req.session.errors = errors;
            return res.redirect('/login');
        }
        req.session.email = email;
        req.session.userId = user._id;
        req.session.userName = {firstName : user.firstName, lastName: user.lastName }; 
        console.log(req.session.userName);
        req.session.isUserAuthenticated = true
        // Redirect to the home page after successful login
        res.redirect('/');
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.userLogout = async (req,res)=>{
    delete req.session.email;
    delete req.session.userId;
    delete req.session.userName
    req.session.isUserAuthenticated = false
    res.redirect('/login'); 
}

