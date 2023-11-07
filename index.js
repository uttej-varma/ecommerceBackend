const express=require('express');
const server=express();
const mongoose=require('mongoose');
const cors=require('cors')
const productRouters=require('./routers/Products')
const brandsRouter=require('./routers/Brands')
const categoryRouter=require('./routers/Categories')
const userRouter=require('./routers/User')
const authRouter=require('./routers/Auth')
const cartRouter=require('./routers/Cart')
const orderRouter=require('./routers/Orders')
server.use(express.json())
async function dataBaseConnection(){
  try{
    await mongoose.connect('mongodb+srv://Uttej:uttejvarma@cluster0.dnpliiz.mongodb.net/ecommerce?retryWrites=true&w=majority');
    console.log('connected to db')
  }
  catch(error){
    console.log(error)
  }
}
dataBaseConnection();
server.use(cors({
  exposedHeaders:["X-Total-Count"]
}))
server.use('/products',productRouters.router)
server.use('/brands',brandsRouter.router)
server.use('/categories',categoryRouter.router)
server.use('/users',userRouter.router)
server.use('/auth',authRouter.router)
server.use('/cart',cartRouter.router)
server.use('/orders',orderRouter.router)
server.get('/',async (req,res)=>{
    res.json({status:"success"})
})



server.listen(3004,()=>{
    console.log("server is running in port 3004")
})