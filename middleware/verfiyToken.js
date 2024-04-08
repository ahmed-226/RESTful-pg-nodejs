import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const verifyToken=(req, res,next) => {
    const authHeader = req.headers["Authorization"] || req.headers['authorization']
    if (!authHeader) {
        return next(res.status(401).json({status:'Error',msg:"token invalid"}))
    }
    const token = authHeader.splite(' ')[1]
    try{
        const decodedToken =jwt.decode(token,process.env.JWT_SECRET_KEY)
        req.currentUser=decodedToken
        next()
    }catch(e){
        return next(res.status(401).json({status:'Error',msg:"invalid token"}))
    }

}