const express=require('express');
const { fetchAllCategories, createCategories } = require('../controller/Category');
const router=express.Router();

router.get('/',fetchAllCategories)
router.post('/',createCategories)

exports.router=router;