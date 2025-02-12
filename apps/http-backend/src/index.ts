import express from "express"
import jwt from "jsonwebtoken"
import { JWT_SECERT } from "@repo/backend-common/config"
import { middleware } from "./middleware";
import {CreateUserSchema, RoomSchema, SigninSchema} from "@repo/common/types"
import {prismaClient} from "@repo/db/client"

const app = express();

app.use(express.json()); 

app.post("/signup",async (req, res)=>{
    const parsedData = CreateUserSchema.safeParse(req.body)
    
        if(!parsedData.success){
            console.log(parsedData.error)
            res.json({
                message:"Incorrect Input"
            })
            return
        }

        try {
           const user =  await prismaClient.user.create({
                data:{
                    email: parsedData.data?.username,
                    password: parsedData.data?.password,
                    name:parsedData.data?.name
                 }
            })
            res.json({
        
                userId: user.id
            })
        } catch (e) {
            res.status(411).send({
                message:"User already exist with this email or username"
            })
        }

    
})

app.post("/signin",async (req, res)=>{

    const parsedData = SigninSchema.safeParse(req.body)
        if(!parsedData.success){
            console.log(parsedData.error)
            res.json({
                message:"Incorrect Input"
            })
            return
        }

    const user  = await prismaClient.user.findFirst({
        where:{
            email:parsedData.data.username,
            password:parsedData.data.password

        }
    })    

    if(!user){
        res.status(411).json({
            message:"Invalid username or password"
        })
    }

    const token = jwt.sign({
        userId:user?.id
    }, JWT_SECERT);

    res.json({
        token
    });
    

})

app.post("/room",middleware,async(req, res)=>{

    const parsedData = RoomSchema.safeParse(req.body)
        if(!parsedData.success){
            res.json({
                message:"Incorrect Imput"
            })
            return
        }

        // @ts-ignore:
         const userId = req.userId;

         try{
            const room = await prismaClient.room.create({
                data:{
                    slug: parsedData.data.name,
                    adminId: userId
                }
            })
            res.json({
                roomId: room.id
            })
        }catch(e){
            res.status(411).json({
                message: "Room exits & Error creating Room"
            })
        }
})


app.listen(3002)