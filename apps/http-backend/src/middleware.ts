import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECERT } from "./confi";


export function middleware (req: Request,res: Response, next: NextFunction){
    const token = req.headers["authorization"] ?? "" ;
    
    const decoded = jwt.verify(token, JWT_SECERT)

    if(decoded){
        req.userId = decoded.userId;
        next()
    }
    else{
        res.status(403).json({
            message:"Unauthorized"
        })
    }
}