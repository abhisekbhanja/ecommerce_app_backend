const mongoose=require("mongoose");

const userSchema=new mongoose.Schema(
    {
        id:{type:Number},
        date:{type:Date},
        title:{type:String},
        category:{type:String},
        description:{type:String},
        price:{type:Number},
        image:{type:String}
    }
)

const User=mongoose.model('productimg',userSchema);
module.exports=User;