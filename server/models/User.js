const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        min:3,
        max:25,
        unique:true
    },
    speed:{
        type:Number,
        require:true,
    }, 
    password:{
        type:String,
        require:true,
        min:3
    },
    total_contest:{
        type:Number, 
        require:true,
    }, 
    accuracy:{
        type:Number,
        require:true,
    }
},
{timestamps:true});  

module.exports = mongoose.model("User",UserSchema);