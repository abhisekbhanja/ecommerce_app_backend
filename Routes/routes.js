const express = require("express");
const User = require("../model/User");
const router = express.Router();
const bcrypt=require("bcrypt");
const jwt = require("jsonwebtoken");
const verify = require("./verifytoken");
const { result } = require("lodash");
const { request, response } = require("express");

router.get("/show", (req, res) => {
 res.send("server working")
});

router.post("/register", (req, res) => {
  const { firstname, lastname, email, mobile,user_question,user_answer } = req.body;
  const userpassword=req.body.password;
  //hashing password
   let password = bcrypt.hashSync(userpassword, 10);
 //console.log(req.body);
 
  const date = new Date();
  //console.log(date.toLocaleTimeString());
  const user = new User({ firstname, lastname, email, mobile, password,user_question,user_answer, date});
  User.findOne({ email: req.body.email })
    .then((userexist) => {
      if (userexist) {
        return res.status(422).send("email already exist");
      }
      user
        .save()
        .then(() => {
          res.status(200).send("signup");
        })
        .catch(() => {
          res.status(500).send("error");
        });
    })
    .catch((err) => {
      //console.log(err);
    });
});

router.post("/login",(req,res)=>{
  //console.log(req.body);
  User.findOne({email:req.body.email}).
  then((loginuser)=>{
  
    //bcrypt.compareSync(req.body.password, loginuser.password)
    //console.log(loginpassword);
    if(bcrypt.compareSync(req.body.password, loginuser.password))
    {
      const showdetails={_id:loginuser._id}
      const token=jwt.sign(showdetails,process.env.SECRET_KEY);
      res.header("login-token",token);
      return res.status(200).json({token:token})}
    else{
      res.status(401).send("invalid credentials")
      //console.log("login failed");
    }

  })
  .catch((err)=>{
    res.status(401).send("invalid credentials")}
    )
})

// router.post("/login", (req, res) => {
//   try {
//     const loginuser = User.findOne({ email: req.body.email });
//     console.log(loginuser.email)
//     if(loginuser && loginuser.password==req.body.password) {
//       const showdetails = {
//         _id: loginuser._id,
//         firstname: loginuser.firstname,
//         lastname: loginuser.lastname,
//         email: loginuser.email,
//         mobile: loginuser.mobile,
//       };
//       const token = jwt.sign(showdetails, "cricketislbw");
//       res.header("login-token", token);
//       res.status(200).json({token:token,msg:"success"})
//     }
//     else{
//       res.status(422).json({msg:"invaild"})
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

router.post("/cartdata",async(req,res)=>{
  //console.log("product added");
 try {

  const product=req.body
  //console.log(product.email);
  let user = await User.findOne({ email:req.body.email});
  if (user) {
    //cart exists for user
    let itemIndex = user.cart_item.findIndex(p => p.id == product.id);

    if (itemIndex > -1) {
      //product exists in the cart, update the quantity
      let productItem = user.cart_item[itemIndex];
      productItem.quantity = productItem.quantity+1;
      user.cart_item[itemIndex] = productItem;
    } else {
      //product does not exists in user, add new item
      user.cart_item.push({ id:product.id, quantity:1, title:product.title,
        price:product.price,
        incPrice:product.price*1,
    image:product.image });
    }
    user = await user.save();
    return res.status(201).send("product added");
  }


 } catch (error) {
  console.log(error)
 }
});

router.put('/increase',async(req,res)=>{
  //console.log(req.body);
  try {

    const product=req.body
    let user = await User.findOne({ _id:product._id});
    if (user) {
      //cart exists for user
      let itemIndex = user.cart_item.findIndex(p => p.id == product.id);
        //increase quantity
        let productItem = user.cart_item[itemIndex];
        productItem.quantity = user.cart_item[itemIndex].quantity+1;
        productItem.incPrice = productItem.price*productItem.quantity;
        user.cart_item[itemIndex] = productItem;
      
      user = await user.save();
      return res.status(201).send(user);
    }
   } catch (error) {
    console.log(error)
   }
})

router.put('/decrease',async(req,res)=>{
  try {

    const product=req.body
    //console.log(product);
    let user = await User.findOne({ _id:product._id});
    if (user) {
      //cart exists for user
      let itemIndex = user.cart_item.findIndex(p => p.id == product.id);
        //increase quantity
        let productItem = user.cart_item[itemIndex];
        productItem.quantity = user.cart_item[itemIndex].quantity-1;
        // productItem.price = productItem.price-55.99;
        productItem.incPrice = productItem.price*productItem.quantity;
        user.cart_item[itemIndex] = productItem;
      
      user = await user.save();
      return res.status(201).send(user);
    }
   } catch (error) {
    console.log(error)
   }
})

router.put("/delete",(req,res)=>{
  // console.log(req.body)
  User.updateOne({_id:req.body._id},{$pull:{cart_item:{id:req.body.id}}})
  .then((res=>{res.send(res)}))
  .catch(err=>{res.send(err)})
 })

router.get("/", verify, async(req, res) => {

 try {
  const result=await User.findOne({_id:req.loginuser._id})
  if(result){
    res.status(200).json({data:result})
  }
 } catch (error) {
  res.send(error)
 }

});

router.get("/user",async(req,res)=>{
  //console.log("user page");
  try {
    const result=await User.findOne({})
    if(result){
      res.status(200).json({data:result})
    }
  } catch (error) {
    res.send(error)
  }
})

const a=0;

router.post("/forgot_passowrd",async(req,res)=>{
  const response=await User.findOne({email:req.body.email})
  try {
    if(response){
      if(response.user_question===req.body.user_question && response.user_answer===req.body.user_answer)
    {
      res.send("verify succeed")
    }
    else{
      // console.log("invalid answer");
      res.send("invalid answer")
    }
    }
    else{
      res.send("email not present")
    }
    
  } catch (error) {
    console.log(error);
  }
})

router.put("/change_passowrd",async(req,res)=>{
 try {
  const response=await User.updateOne({email:req.body.email},{$set:{password:req.body.password}})
 if(response){
  res.send("password has changed")
 }

} catch (error) {
  res.send(error)
 }
})



module.exports = router;
