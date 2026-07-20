import { NextFunction, Request, Response } from "express";
import jwt,{ JwtPayload } from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET!;

export const authMiddleware = async(request:Request,response:Response,next:NextFunction) => {
    const authHeader = request.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return response.status(401).json({ message: 'Unauthorized: Missing or invalid token format' });
    }
    
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token,JWT_SECRET) as JwtPayload;
        request.user = {
            id: decoded.id as string,
            username: decoded.username as string,
            email: decoded.email as string,
            role: decoded.role as string,
        };
        return next();
    } catch (error) {
        return response.status(403).json({
            message: "Forbidden: Invalid token",
        });
    }
}