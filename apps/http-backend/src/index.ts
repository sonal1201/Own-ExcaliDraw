import express from "express"
import jwt from "jsonwebtoken"
import { JWT_SECERT } from "@repo/backend-common/config"
import { middleware } from "./middleware";
import {CreateUserSchema, RoomSchema} from "@repo/common/types"

const app = express();

app.use(express.json()); 

app.post("/signup",(req, res)=>{
    const data = CreateUserSchema.safeParse(req.body)
        if(!data.success){
            res.json({
                message:"Incorrect Imput"
            })
            return
        }
        
    res.json({
        
        //db call
        userId: 123
    })

    
})

app.post("/signin",(req, res)=>{

    const data = CreateUserSchema.safeParse(req.body)
        if(!data.success){
            res.json({
                message:"Incorrect Imput"
            })
            return
        }

    const userId =1;
    const token = jwt.sign({
        userId
    }, JWT_SECERT);

    res.json({
        token
    });
    

})

app.post("/room",middleware,(req, res)=>{

    const data = RoomSchema.safeParse(req.body)
        if(!data.success){
            res.json({
                message:"Incorrect Imput"
            })
            return
        }

    //db call
    res.json({
        roomId:123
    })
})


app.listen(3001)