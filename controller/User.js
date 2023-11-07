const {User}=require('../models/User')



exports.fetchLoggedInUser=async (req,res)=>{
    
    try{
        const _id=req.params.id
        const user=await User.findById(_id).exec();
        res.status(200).json(user)
    }
    catch(e){
          res.status(400).json({
            message:e.message
          })
    }

}

exports.updateUser=async (req,res)=>{
    const _id=req.params.id
     try{
        const user= await User.findByIdAndUpdate(_id,req.body,{new:true});
        res.status(200).json( user )
     }
     catch(e){
        res.status(400).json({
            message:e.message
        })
     }
}