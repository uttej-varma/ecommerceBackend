const { Cart } = require("..//models/Cart");

exports.addTocart = async (req, res) => {
  try {
    const item = await Cart.create(req.body);
    const addedItem= await item.populate('product');
    res.status(201).json(addedItem);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.fetchItemsByUserId = async (req, res) => {
  const { user } = req.query;
  try {
    const cartItems = await Cart.find({ user: user })
    .populate('user').populate('product')
      
    res.status(200).json(cartItems);
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};

exports.updateCart=async (req,res)=>{
    const _id=req.params.id
     try{
        const updatedProduct= await Cart.findByIdAndUpdate(_id,req.body,{new:true})
        .populate('product');
        res.status(200).json(
            
            updatedProduct
        )
     }
     catch(e){
        res.status(400).json({
            message:e.message
        })
     }
}

exports.deleteFromCart=async (req,res)=>{
    const _id=req.params.id;
    try{
        const doc=await Cart.findByIdAndDelete(_id);
        res.status(201).json(doc);
    }
    catch(e){
        res.status(400).json(e)
     }
}