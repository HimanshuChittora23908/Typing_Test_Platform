const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const entryRoute = require('./routes/entry');

dotenv.config();

const DB = process.env.MONGO_URL;

mongoose.connect(DB).then(()=>{
    console.log("Success")
}).catch((err)=>{
    console.log("Error")
});

app.use(express.json());
 
app.use("/api/entry" , entryRoute) 

app.listen(5000,()=>{
    console.log("Backend is running")
})

