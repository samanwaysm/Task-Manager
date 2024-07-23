const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    firstName:{
        type: String,
        required:true
    },
    lastName:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String
    },
    googleId:{
        type: String
    }
})

const userDb = mongoose.model('user', schema);

module.exports = userDb;