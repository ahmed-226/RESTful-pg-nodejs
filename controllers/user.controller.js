import { dataBase } from "../services/database";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { geenrateJWT } from "../services/generateJWT";
import dotenv from 'dotenv'
import { text } from "express";

dotenv.config()

export const getAllUsers=async (req, res) => {
    try{
        const result = await dataBase.query(`Select * from Users`)
        return res.status(200).json(result.rows);
    }catch(e){
        return res.status(500).json({error:e.message});
    }
}

export const getUserById = async (req, res) => {
    try{

        const id=req.params.id

        const result = await dataBase.query(
            {
                text:`
                    Select * from Users
                    where id =$1
                    `,
                values:[id]
            })
        return res.status(200).json(result.rows[0]);
    }catch(e){
        return res.status(500).json({error:e.message});
    }
}

export const register = async (req, res) => {

    
    try{
        const {firstName,lastName,email ,password,role} =req.body

        if (!firstName||!lastName||!email||!password) {
            return res.status(422).json({error:"All fields are required"})
        }
        
        const existResult=await dataBase.query({
            text: `
            select exists (select * from Users where email =$1)
        `,
            values: [email] 
        })

        if(existResult.rows[0].exists){
            return res.status(409).json({error: ` User ${firstName} ${lastName} already exist `})
        }

        const hashedpassword = await bcrypt.hash(password, 10)
        let result= await dataBase.query(
            {
                text:   
                    `
                    insert into Users(firstName, lastName,email, password,token,role) 
                    values ($1,$2,$3,$4,$5,$6) 
                    returning *
                    `,
                values:
                    [
                        firstName, 
                        lastName,
                        email, 
                        hashedpassword,
                        null,
                        role ? role :'user',

                    ]
            }
        )

        const user=result.rows[0]
        const token =await geenrateJWT({email:email,id:user.id,role:user.role})

        result= await dataBase.query(
            {
                text:   
                    `
                    update Users 
                    set token=$1 
                    where email=$2
                    returning *
                    `,
                values:
                    [   
                        token,
                        email
                    ]
            }
        )


        return res.status(200).json(result.rows[0]);

        }catch(e){
            return res.status(500).json({error:e.message});
        }

}

export const login = async(req, res) =>{

    const {email, password}=req.body
    if(!email && !password){
        return res.status(309).json({status:"Fail",msg:'All fields are required'})
    }

    const existResult=await dataBase.query({
        text: `
        select exists (select * from Users where email =$1)
    `,
        values: [email] 
    })

    if(!existResult.rows[0].exists){
        return res.status(409).json({error: ` User ${firstName} ${lastName} is not exist `})
    }

    let user=await dataBase.query({
        text: `
            select * 
            from Users 
            where email =$1
            `,
        values:[email]
    })
    user=user.rows[0]

    const matchedPassword = await bcrypt.compare(password, user.password)
    if(matchedPassword){
        
        const token=await geenrateJWT({email:user.email,id:user.id,role:user.role})
        
        res.status(200).json({ status: 'Success',  user: { token } })
    }else{
        return res.status(500).json({ status: "Error", msg: "something is wrong with" }) 
    }

    
}