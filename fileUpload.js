const express = require("express");
const app = express()
const router = express.Router();
//const multer = require('multer');
const mongoose=require("mongoose");
const User = require('./User');
//const path = require('path');
///////////////////////////
//for path
//const imagepath='images'
//E:\PROJECT\ecommerce project\backend\ecommerce backend\images\image_1688583556566.jpg
//app.use(`/${imagepath}`, express.static(imagepath));



// const imageStorage = multer.diskStorage({
//     // Destination to store image     
//     destination: imagepath, 
//       filename: (req, file, cb) => {
//           cb(null, file.fieldname + '_' + Date.now() 
//              + path.extname(file.originalname))
//             // file.fieldname is name of the field (image)
//             // path.extname get the uploaded file extension
//     }
// });

// const imageUpload = multer({
//     storage: imageStorage,
//     limits: {
//       fileSize: 1000000 // 1000000 Bytes = 1 MB
//     },
//     fileFilter(req, file, cb) {
//       if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) { 
//          // upload only png and jpg format
//          return cb(new Error('Please upload a Image'))
//        }
//      cb(undefined, true)
//   }
// })

// router.post('/uploadImage', imageUpload.single('image'), (req, res) => {
//     const url = req.protocol + '://' + req.get('host') 
//     //res.send(`/${imagepath}/`)
//    try {
//     const user=new User({id:req.body.id,
//         title:req.body.title,
//         category:req.body.category,description:req.body.description,
//         price:req.body.price,
//         // image:req.body.image,
//         date:new Date(),
//         image:url+`/${imagepath}/`+req.file.filename})
//     user.save()
//     res.status(200).send({msg:"product added"})
//     console.log("product added");
//    } catch (error) {
//     console.log(error)
//     res.status(500).send({ error: error.message })
//     console.log("errorrrrrrrrrrrrr");
//    }


// })

////////////////////////////
router.get('/showproducts',async(req,res)=>{
    try {
        const show_product=await User.find({})
        if(show_product){
            res.status(200).send(show_product)
        }
    } catch (error) {
        //res.status(500).json({error:error})
    }
})

router.get("/showproducts/:id",(req,res)=>{
    try {
       User.findOne({id:req.params.id},(err,result)=>{
            if(err){res.status(500).json({error:err})}
            else{
                {res.status(200).json({data:result})}            }
       })
    } catch (error) {
        
    }
})

module.exports = router;