const {Order}=require('../models/Order');

exports.fetchAllOrders = async (req, res) => {
  let totalDocsCount= Order.find({deleted:{$ne:true}})
  let query= Order.find({deleted:{$ne:true}});
 
 
  if(req.query._sort && req.query._order)
  {
      query=  query.sort({[req.query._sort]:req.query._order});
  }
  if(req.query._page && req.query._limit)
  {
      const pageSize=req.query._limit;
      const page=req.query._page
      query=  query.skip(pageSize*(page-1)).limit(pageSize);
  }
  const totalCount=await totalDocsCount.count().exec();
  try {
    const orders = await query.exec();
    res.set('X-Total-Count',totalCount);  
    res.status(200).json(orders);
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};

exports.createOrder = async (req, res) => {
    try {
      const craetedOreder = await Order.create(req.body);
      res.status(201).json(craetedOreder);
    } catch (e) {
      res.status(400).json(e);
    }
  };
  
  exports.fetchLoggedInUserOrders = async (req, res) => {
    
    try {
      const orders = await Order.find({ user: req.user.id })
        
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
          const updatedOrder= await Order.findByIdAndUpdate(_id,req.body,{new:true});
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
 