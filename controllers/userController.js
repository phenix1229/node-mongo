const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Users = require('../models/Users')
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{
    console.log('MongoDB connected');
}).catch(err => console.log(`Mongo Error: ${err}`));



module.exports = {
    register: (req,res)=>{
        return new Promise((resolve, reject)=>{
            const {name,email,password} = req.body;
            //validate input
            if(name.length === 0 || email.length === 0 || password.length === 0){
                return res.json({message:'All fields must be completed'});
            };
            Users.findOne({email:req.body.email}).then(user =>{
                if(user){
                    return res.status(301).json({message:'User already exists'});
                }
                const newUser = new Users();
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                newUser.name = name;
                newUser.email = email;
                newUser.password = hash;
    
                newUser.save().then((user)=>{
                    res.status(200).json({message:'user created', user});
                }).catch(err => {
                    reject(err);
                });
            });
        });
    },
    
    login:(req,res) => {
        return new Promise((resolve, reject) => {
            Users.findOne({email:req.body.email})
            .then((user) => {
                bcrypt.compare(req.body.password, user.password)
                .then((user) => {
                    return res.send(user === true ? 'You are now logged in' : 'Incorrect credentials');
                })
                .catch(err => {
                    return res.status(500).json({message:'Server error', err})
                })
            })
            .catch(err => reject(err));
        })
    },
    
    updateProfile:(req, res) => {
        return new Promise((resolve, reject) => {
            Users.findById( {_id: req.params.id})
            .then((user) => {
                const {name, email} = req.body;
                user.name = name ? name : user.name;
                user.email = email ? email : user.email;
    
                user.save()
                .then(user => {
                    return res.status(200).json({message:'User updated', user});
                })
                .catch(err => reject(err));
            })
            .catch(err => res.status(500).json({message:'Server error', err}));
        })
    },
    
    deleteProfile:(req, res) => {
        return new Promise((resolve, reject) => {
            Users.findByIdAndDelete({_id:req.params.id})
            .then(user => {
                return res .status(200).json({message:'User deleted', user});
            })
            .catch(err => res.status(400).json({message:'No user to delete'}, err));
        })
        .catch(error => {
            return res.status(500).json({message:'Server error'});
        })
    }
}