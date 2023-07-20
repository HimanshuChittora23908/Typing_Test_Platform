const router = require('express').Router();
const User = require("../models/User")
const bcrypt = require('bcrypt')



//REGISTER
router.post("/register",async(req,res)=>{
    try{
    //for hashing password 
    const first = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,first)

    const newUser = new User({
        username:req.body.username,
        accuracy:0,
        password:hashedPassword,
        total_contest: 0,
        speed:0
    })    

        const user = newUser.save();
        res.status(200).json(user)
    }catch(err){   
     res.status(500).json(err)
    } 
})
 
//LOGIN
router.post('/login',async(req,res)=>{
    try{    
    const user = await User.findOne({email:req.body.email});
    !user && res.status(404).json("User not found");

    const correctPassword = await bcrypt.compare(req.body.password,user.password);
    !correctPassword && res.status(400).json("User not found");

    res.status(200).json(user)
    }catch(err){
        res.status(500).json(err)
    }
})

router.put("/update",async(req,res)=>{
    try{   
        const resume = await User.findByIdAndUpdate(req.body.id,{
            $set:req.body, 
        })
        res.status(200).json("Account has been updated")
    }catch(e){
        console.log(e)
    }
}
)
   


module.exports = router 