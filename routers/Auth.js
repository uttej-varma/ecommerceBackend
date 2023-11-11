const express = require('express');
const passport=require('passport')
const { createUser,checkAuth, loginUser } = require('../controller/Auth');
const router=express.Router();
router.post('/login',passport.authenticate('local'), loginUser)
router.post('/signup',createUser)
router.get('/check',passport.authenticate('jwt'),checkAuth)


exports.router=router;