var express = require('express');
var router = express.Router();
var userModel = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.post('/register', function(req, res, next) {
    userModel.register(
        new userModel({
            username: req.body.username,
            name: req.body.name,
            creationDate: new Date()
        }),
        req.body.password,
        function(err, user) {
            console.log(user);
            if (err) res.jsonp(err);
            else res.status(201).send('Registado com sucesso');
        }
    )
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    jwt.sign(
        {
            username: req.user.username,
            name: req.user.name,
            creationDate: new Date()
        },
        'EngWeb2025',
        { expiresIn: '1d' },
        (err, token) => {
            if (err) res.jsonp(err)
            else res.status(201).jsonp({ token : token })
        }
    )
})

module.exports = router;