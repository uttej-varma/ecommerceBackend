const express=require('express');
const { createOrder, fetchLoggedInUserOrders, deleteOrder, updateOrder, fetchAllOrders } = require('../controller/Order');
const router=express.Router();

router.post('/',createOrder);
router.get('/own',fetchLoggedInUserOrders);
router.get('/',fetchAllOrders)
router.delete('/:id',deleteOrder);
router.patch('/:id',updateOrder)
exports.router=router