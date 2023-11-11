const express=require('express');
const { fetchLoggedInUser, updateUser } = require('../controller/User');
const router=express.Router();


router.get('/own',fetchLoggedInUser)
router.patch('/',updateUser)

exports.router=router;