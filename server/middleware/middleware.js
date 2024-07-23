const express = require("express");
const session = require("express-session");
var userDb = require("../model/userSchema")
const app = express();


function isUserAuthenticated(req, res, next) {
    if (req.session.isUserAuthenticated === true) {
      return next();
    }
    res.redirect("/login");
  }
  
  function isUserNotAuthenticated(req, res, next) {
    if (req.session.isUserAuthenticated === true) {
      return res.redirect("/");
    }
    next();
  }


  module.exports = {
    isUserAuthenticated,
    isUserNotAuthenticated
  };