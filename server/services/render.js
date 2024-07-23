const axios = require('axios');

exports.loginRoute=(req,res)=>{
    const errors = req.session.errors || {};
    req.session.errors = {};
    res.render("login",{errors},(err,html)=>{
       if(err){
          console.log(err);
       }
       res.send(html)
    })
} 

exports.registerRoute=(req,res)=>{
    const errors = req.session.errors || {};
    req.session.errors = {};
    res.render("register",{errors},(err,html)=>{
       if(err){
          console.log(err);
       }
       res.send(html)
    })
} 

// exports.homeRoute=(req,res)=>{
//     res.render("home",(err,html)=>{
//        if(err){
//           console.log(err);
//        }
//        res.send(html)
//     })
// } 

exports.homeRoute = (req,res,next)=>{
    const {userId} = req.session
    axios.get(`http://localhost:${process.env.PORT}/api/displayTask?userId=${userId}`)
     .then(function (response){
         res.render("home",{tasks: response.data},(err,html)=>{
          if(err){
             console.log(err);
          }
          res.send(html)
       })
     })
     .catch(err => {
       next(err)
    });
}