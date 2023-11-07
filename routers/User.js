const express=require('express');
const { fetchLoggedInUser, updateUser } = require('../controller/User');
const router=express.Router();


router.get('/:id',fetchLoggedInUser)
router.patch('/:id',updateUser)

exports.router=router;