const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const bodyParser = require('body-parser');
//validation
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

const UserRouter = express.Router();

UserRouter.use(bodyParser.json());

//data model
const User = require('../models/User');


UserRouter.post('/register',(req,res)=>{
    const { errors,isValid } = validateRegisterInput(req.body);

    //check validations
    if(!isValid)
    {
        return res.status(400).json(errors);
    }

    User.findOne({email:req.body.email })
    .then(user =>{
        if(user)
        {
            return res.status(400).json({email:"Email already exists"});
        }
        else
        {
            const newUser = new User({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password
            });

            //hash password
            bcrypt.genSalt(10,(err,salt) =>{
                bcrypt.hash(newUser.password, salt ,(err,hash)=>{
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                    .then(user=>{
                        res.json(user);
                    })
                    .catch(err =>console.log(err));
                });
            });
        }
    });
});

UserRouter.post('/login',(req,res)=>{
    const { errors,isValid }=validateLoginInput(req.body);

    //validation check
    if(!isValid)
    {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
    .then(user=>{
        if(!user)
        {
            return res.status(400).json({emailnotfound:"Email not found"});
        }

        bcrypt.compare(password, user.password)
        .then(isMatch=>{
            if(isMatch)
            {
                const payload = {
                    id:user.id,
                    name:user.name
                };
                jwt.sign(payload ,keys.secretOrKey , {
                    expiresIn:140000
                },(err,token)=>{
                    res.json({success:true,token:"Bearer "+token});
                });
            }
            else
            {
                return res.status(400).json({ passwordincorrect:"password incorrect"});
            }
        });
    });
});

module.exports = UserRouter;
