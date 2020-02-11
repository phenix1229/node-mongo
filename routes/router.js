const express = require('express');
const router = express.Router();
const Users = require('../models/Users')
const userController = require('../controllers/userController');

router.get('/', (req, res) => {
    Users.find({}).then(users => res.json(users));
});

router.post('/login', userController.login);

router.post('/register', userController.register);

router.put('/updateProfile/:id', userController.updateProfile);

router.delete('/deleteProfile/:id', userController.deleteProfile);

module.exports = router;