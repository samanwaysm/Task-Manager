const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv')
require('dotenv').config()
const morgan = require('morgan')

const connectDB = require('./server/database/connection')
const errorMiddleware = require('./server/middleware/errorHandling')

const PORT = process.env.PORT || 8080;


app.use(express.json())
app.use(express.urlencoded({extended:true}))


const cacheTime = 60;
app.use((req, res, next) => {
    res.setHeader("Cache-Control", `public,no-store, must-revalidate, max-age=${cacheTime}`);
    res.setHeader("Pragma", "no-cache");  
    next()
})

// mongodb connection

connectDB();
const router = require('./server/routes/router');
const authRouter = require('./server/routes/authRoute');



app.use(morgan('tiny'));


app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'assets')));

app.use(session({
    secret: 'your-secret-key', // Change this to a random and secure string
    resave: false,
    saveUninitialized: true,
}));


app.use('/',router );
app.use('/',authRouter)

app.get("*",function(req,res){
  res.status(404).render("404Error")
})
app.use(errorMiddleware)


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});