const express=require('express');
const { createUser,checkUser } = require('../controller/Auth');
const router=express.Router();

router.post('/signup',createUser)
router.post('/login', checkUser)


exports.router=router;