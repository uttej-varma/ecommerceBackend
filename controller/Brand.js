const {Brand}=require('../models/Brand');

exports.createBrand=async (req,res)=>{
    try{
        const brand=await Brand.create(req.body);
        res.status(201).json({
            message:'brand added successfully',
            brand
        })
    }
    catch(e){
        res.status(400).json({
            message:e.message
        })
    }

}

exports.fetchAllBrands=async (req,res)=>{
    let brands=Brand.find({});

    try{
        const allBrands=await brands.exec();
        res.status(200).json(
            allBrands
        )
    }
    catch(e){
        res.status(400).json({
            message:e.message
        })
    }
}