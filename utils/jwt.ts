import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const verifyToken = (token : string, secret : string) => {
    try {
        const verifyToken = jwt.verify(token, secret);
        return {
            success : true,
            data : verifyToken
        }
        
    } catch (error : any) {
        return {
            success : false,
            message : error.message,
            error
        }
        
    }
}

export const jwtUtils = {
    verifyToken
}