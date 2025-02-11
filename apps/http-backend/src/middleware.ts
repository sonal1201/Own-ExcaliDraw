import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECERT } from "@repo/backend-common/config";


export interface CustomRequest extends Request{
    userId?: string
}

export function middleware (req: CustomRequest,res: Response, next: NextFunction){
    const token = req.headers["authorization"] ?? "" ;
    
    const decoded = jwt.verify(token, JWT_SECERT) as CustomRequest


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