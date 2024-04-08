import jwt from "jsonwebtoken"

export const geenrateJWT=async (payload)=>{
    const token =jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        {expiresIn:"10m"}
    )
    return token
}