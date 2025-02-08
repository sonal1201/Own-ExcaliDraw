import express, { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { JWT_SECERT } from "./confi";
import { middleware } from "./middleware";

const app = express();

app.use(express.json()); 

app.post("/signup",(req: Request, res: Response)=>{

    res.json({

        //db call
        userId: 123
    })

    
})

app.post("/signin",(req: Request, res: Response)=>{

    const userId =1;
    const token = jwt.sign({
        userId
    }, JWT_SECERT);

    res.json({
        token
    });

})

app.post("/room",middleware,(req: Request, res: Response)=>{

    //db call
    res.json({
        roomId:123
    })
})


app.listen(3001)