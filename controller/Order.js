const {Order}=require('../models/Order');

exports.createOrder = async (req, res) => {
    try {
      const craetedOreder = await Order.create(req.body);
      res.status(201).json(craetedOreder);
    } catch (e) {
      res.status(400).json(e);
    }
  };
  
  exports.fetchLoggedInUserOrders = async (req, res) => {
    const  user  = req.query.user;
    try {
      const orders = await Order.find({ user: user })
        
      res.status(200).json(orders);
    } catch (e) {
      res.status(400).json({
        message: e.message,
      });
    }
  };
  
  exports.updateOrder=async (req,res)=>{
      const _id=req.params.id
       try{
          const updatedOrder= await Order.findByIdAndUpdate(_id,req.body,{new:true})
          .populate('product');
          res.status(200).json(
              
            updatedOrder
          )
       }
       catch(e){
          res.status(400).json({
              message:e.message
          })
       }
  }
  
  exports.deleteOrder=async (req,res)=>{
    const _id=req.params.id;
    try{
        const doc=await Order.findByIdAndDelete(_id);
        res.status(201).json(doc);
    }
    catch(e){
        res.status(400).json(e)
     }
}
 