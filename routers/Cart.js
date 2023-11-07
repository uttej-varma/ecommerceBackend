const express=require('express');
const { addTocart, fetchItemsByUserId, deleteFromCart, updateCart } = require('../controller/Cart');
const router=express.Router();

router.post('/',addTocart);
router.get('/',fetchItemsByUserId);
router.delete('/:id',deleteFromCart);
router.patch('/:id',updateCart)
exports.router=router