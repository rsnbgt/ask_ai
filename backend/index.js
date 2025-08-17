import express from "express"
import ImageKit from "imagekit";
import cors from "cors";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import { clerkClient, requireAuth, getAuth } from '@clerk/express'
import dotenv from "dotenv";

dotenv.config();
const port =process.env.PORT || 3000;
const app=express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-frontend.onrender.com"], // allow local + deployed frontend
    credentials: true, // allow cookies/auth headers
  })
);

app.use(express.json())

const connect=async()=>{
    try{
        await mongoose.connect(process.env.MONGO)
        console.log("connected to mongoDB")
    }catch(err){
        console.log(err)
    }
}

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT, // https://ik.imagekit.io/your_imagekit_id
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
});

// app.get("/api/test",requireAuth(),(req,res)=>{
//     const userId=req.auth().userId;
//     console.log(userId)
//     res.send("Success!")
// })

app.get("/api/upload",(req,res)=>{
    const result=imagekit.getAuthenticationParameters();
    res.send(result);
})

app.post("/api/chats",requireAuth() ,async (req,res)=>{
    const userId=req.auth().userId;
    const {text}=req.body

    try{
        //create new chat
        const newChat=new Chat({
            userId:userId,
            history:[{role:"user",parts:[{text}]}],
        })
        const savedChat=await newChat.save();
        const userChats=await UserChats.find({userId:userId});
        if(!userChats.length){
            const newUserChats=new UserChats({
                userId:userId,
                chats:[{
                    _id:savedChat.id,
                    title:text.substring(0,40)
                    
                }]
            })
            await newUserChats.save();
        }else{
            await UserChats.updateOne({userId:userId},{
                $push:{
                    chats:{
                        _id:savedChat._id,
                        title:text.substring(0,40),
                    },
                },
            });
            res.status(201).send(newChat._id);
        }
    }catch(err){
        console.log(err)
        res.status(500).send("Error creating chat!")
    }
})

app.get("/api/userchats",requireAuth(),async(req,res)=>{
    const userId=req.auth().userId;

    try{
        const userChats=await UserChats.find({userId});

        res.status(200).send(userChats[0].chats);
    }catch(err){
        console.log(err)
        res.status(500).send("Error fetching userchats!");
    }
})
app.get("/api/chats/:id",requireAuth(),async(req,res)=>{
    const userId=req.auth().userId;

    try{
        const chat=await Chat.findOne({_id:req.params.id,userId});

        res.status(200).send(chat);
    }catch(err){
        console.log(err)
        res.status(500).send("Error fetching chat!");
    }
})

app.put("/api/chats/:id",requireAuth(),async(req,res)=>{
    const userId=req.auth().userId;
    const {question,answer,img}=req.body;

    const newItems=[
        ...(question
        ? [{role:"user", parts:[{text:question}], ...(img && {img})}]
        : []),
        {role:"model",parts:[{text:answer}]}
    ];

    try{
        const updatedChat=await Chat.updateOne({_id:req.params.id,userId},{
            $push:{
                history:{
                    $each:newItems,
                }
            }
        })

        res.status(200).send(updatedChat);
    }catch(err){
        console.log(err)
        res.status(500).send("Error adding chat!");
    }
})

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use((err,req,res,next)=>{
    console.log(err.stack);
    res.status(401).send('Unauthenticated!');
});

app.listen(port,()=>{
    connect()
    console.log("Server is running 3000")
});