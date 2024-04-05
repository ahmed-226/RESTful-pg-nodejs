import { text } from 'express';
import { dataBase } from '../services/database.js';

export const getAllCategories=async (req,res)=>{
    try{
        const result=await dataBase.query("select * from category")
        return res.status(200).json(result.rows);
    }catch(e){
        return res.status(500).json({error:e.message});
    }
}

export const getCategoryById=async (req,res)=>{
    try{

        const id =req.params.id
        const result=await dataBase.query({
            text:"select * from category where id=$1",
            values :[id]
        })
        return res.status(200).json(result.rows[0]);
    }catch(e){
        return res.status(500).json({error:e.message});
    }
}

export const createCategory=async (req,res)=>{
    try{

        const {name} =req.body
        if (!name) {
            return res.status(422).json({error:"Name is required"})
        }

        const existResult=await dataBase.query({
            text: `
            select exists (select * from category where name =$1)
        `,
            values: [name] 
        })

        if(existResult.rows[0].exists){
            return res.status(409).json({error: ` Category ${name} already exist `})
        }

        const result= await dataBase.query(
            {
                text: 'insert into category(name) values ($1) returning *',
                values:[name]
            }
        )
        return res.status(200).json(result.rows[0]);

    }catch(e){
        return res.status(500).json({error:e.message});
    }
}

export const updateCategory = async(req,res)=>{
    try{

        const {name}=req.body
        const id=req.params.id

        if (!name) {
            return res.status(422).json({error:"Name is required"})
        }else{
            const existResult=await dataBase.query({
                text: `
                select exists (select * from category where name =$1)
            `,
                values: [name] 
            })
    
            if(existResult.rows[0].exists){
                return res.status(409).json({error: ` Category ${name} already exist `})
            }
        }

        const result=await dataBase.query({
            text:`
                update category
                set name =$1, updated_date = current_timestamp
                where id=$2
                returning *
            `,
            values:[name,id]
        })

        if(result.rowCount==0){
            return res.status(404).json({error:'Category not found'})
        }
        
        return res.status(200).json(result.rows[0])

    }catch(err){
        return res.status(500).json({error:err.message});
    }
}

export const deleteCategory=async (req,res)=>{
    try{
        
        const id=req.params.id

        const countResult = await dataBase.query({
            text: 'SELECT COUNT(*) FROM product WHERE category_id = $1',
            values: [id]
        })

        if (countResult.rows[0].count > 0) {
            return res.status(409).json({ error: `Category is being used in ${countResult.rows[0].count} product(s)` })
        }

        const result=await dataBase.query({
            text:`
                delete from category where id=$1
            `,
            values:[id]
        })

        if (result.rowCount == 0) {
            return res.status(404).json({ error: 'Category not found' })
        }
        
        return res.status(204).json({message:"delete success"})

    }catch(e){
        return res.status(500).json({error:err.message});
    }
}