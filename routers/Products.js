const express=require('express');
const router=express.Router();
const { createProduct, fetchAllProducts, fetchProductById,updateProductById } = require('../controller/Product');

router.post('/',createProduct)
router.get('/',fetchAllProducts)
router.get('/:_id',fetchProductById)
router.patch('/:_id',updateProductById)

exports.router=router;