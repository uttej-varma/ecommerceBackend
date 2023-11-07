const express=require('express');
const { createOrder, fetchLoggedInUserOrders, deleteOrder, updateOrder } = require('../controller/Order');
const router=express.Router();

router.post('/',createOrder);
router.get('/',fetchLoggedInUserOrders);
router.delete('/:id',deleteOrder);
router.patch('/:id',updateOrder)
exports.router=router