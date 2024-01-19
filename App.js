const express = require('express');
const mongoose=require('mongoose');
const fs=require('fs');
const short = require('short-uuid');
 require('dotenv').config();

 const PORT =process.env.PORT || 3001;

 /** DB Connection */
 mongoose.connect(process.env.DB_URL).then((connection)=>{
    console.log("DB is connected");
 }).catch((err)=>{
    console.log(err);
 })

 const app= express();
 const data=fs.readFileSync("./data.json","utf-8");
 const userData=JSON.parse(data);
 app.use(express.json());
//  app.use(function(){
//    if(isEmpty){

//    }
//    else{
//       next();
//    }
//  })

app.get('/api/user/',getUserHandler);
app.post('/api/user/',createUserHandler);
app.get('/api/user/:id',getUserById);

function getUserHandler(req,res){
    try {
        let msg=''
        if(userData.length!==0)
          msg='Data Found'
        else
         msg='Data not Found'
         res.json({
           status:'success',
           statusCode:200,
           message:msg,
           data:userData
     
         })
     } catch (error) {
        res.status(500).json({
           status:500,
           message:error.message
        })
     }
}

function createUserHandler(req,res){
    const id=short.generate();
    const userDetails=req.body;
    const isEmpty=Object.keys(userDetails).length===0;
    if(isEmpty){
       res.status(400).json({
          status:400,
          message:"Body can not be empty"
       })
    }
    else{
       userDetails.id=id;
       console.log('new user',userDetails);
       userData.push(userDetails);
       fs.writeFile("./data.json",JSON.stringify(userData),(err)=>{
          if(err){
             console.log(err);
          }
             res.json({
                status:200,
                message:"User added successfully",
                data:userDetails
             })
       })
    }
}

function getUserById(req,res){
    const {id}=req.params;
    const user=userData.find((user)=>user.id===id);
    console.log("filterd user",user)
    if(!user){
       res.status(404).json({
          status:404,
          message:"User Not Found"
       })
    }
    res.json({
       status:200,
       message:"User Found",
       data:user
    })
}


 app.use(function(req,res){
    res.status(200).send('Hello World');
 })
 
 app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
 })