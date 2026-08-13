import jwt from "jsonwebtoken";

const verifyToken = (token: string, secret: string) => {
    try {
        const decoded = jwt.verify(token, secret);
        return {
            success: true,
            data: decoded,
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Invalid token",
            error,
        };
    }
};

export const jwtUtils = {
    verifyToken
}