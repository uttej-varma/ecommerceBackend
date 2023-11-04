const {Category}=require('../models/Category');

exports.createCategories=async (req,res)=>{
    try{
        const category=await Category.create(req.body);
        res.status(201).json({
            message:'category added successfully',
            category
        })
    }
    catch(e){
        res.status(400).json({
            message:e.message
        })
    }

}

exports.fetchAllCategories=async (req,res)=>{
    let category=Category.find({});

    try{
        const allCategory=await category.exec();
        res.status(200).json(
            allCategory
        )
    }
    catch(e){
        res.status(400).json({
            message:e.message
        })
    }
}