const {User}=require('../models/User')

exports.createUser= async (req,res)=>{
    //todo: password hash
    try{
        const checkUser=await User.findOne({email:req.body.email})
        if(!checkUser){
            const user=await User.create(req.body);
            res.status(201).json({id:user.id,role:user.role})
        }
        else{
            res.status(401).json(
               {
                   message:'user already exist'
               }
           )
       }
        
    }
    catch(e){
          res.status(400).json({
            message:e.message
          })
    }

    
};

exports.checkUser=async(req,res)=>{
    //toDo: address to be made independent
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email:email});
        if(!user){
            res.status(401).json(
                {
                    message:'user not registered'
                }
            )
        }
        else if(user && (user.password===password))
        {
              res.status(200).json({id:user.id,role:user.role})
        }
        else{
             res.status(401).json(
                {
                    message:'invalid email or password'
                }
            )
        }
        
    }
    catch(e){
          res.status(400).json({
            message:e.message
          })
    }
   

}