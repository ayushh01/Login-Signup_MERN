const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();

const UserRouter = require('./routes/users');

//port
const port = process.env.PORT || 5000;

//body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//database
const db=require("./config/keys").mongoURI;

//connect to mongodb
mongoose.connect(db , { useNewUrlParser:true , useUnifiedTopology:true})
.then((db)=>{
    console.log('Connected to DataBase');
})
.catch((err)=>console.log(err));


//passport initilize    
app.use(passport.initialize());
require('./config/passport')(passport);




//User routes
app.use('/users',UserRouter);

//listen
app.listen(port ,()=>{
    console.log(`Server is running on port: ${port}`);
})