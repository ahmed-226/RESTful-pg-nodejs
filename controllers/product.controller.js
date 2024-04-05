import { dataBase } from '../services/database.js';

export const getAllProducts=async (req,res)=>{
    try{
        const result = await dataBase.query(`
            SELECT p.id, p.name, p.description, p.price, p.currency, 
                p.quantity, p.active, p.create_date, p.updated_date,
                
                (SELECT ROW_TO_JSON(category_obj) FROM (
                    SELECT id, name FROM category WHERE id = p.category_id
                ) category_obj) AS category
                
            FROM product p`)
        return res.status(200).json(result.rows);
    }catch(e){
        return res.status(500).json({error:e.message});
    }
}

export const getProductById=async (req,res)=>{
    try{

        const id = req.params.id
        const result = await dataBase.query({
            text:`
                SELECT p.id, p.name, p.description, p.price, p.currency, 
                p.quantity, p.active, p.create_date, p.updated_date,
                (SELECT ROW_TO_JSON(category_obj) FROM (
                    SELECT id, name FROM category WHERE id = p.category_id
                ) category_obj) AS category
                
                FROM product p
                where p.id = $1
            `,
            values:[id]
        })

        if(result.rowCount==0){
            return res.status(404).json({error: ' Product not found'})
        }

        return res.status(200).json(result.rows[0])

    }catch(e){
        return res.status(500).json({error:e.message})
    }
}

export const getProductByCategoryId=async (req,res)=>{
    try{
        
        const categoryId = req.params.categoryId
        const existResult=await dataBase.query({
            text: `
            select exists (select * from category where id =$1)
        `,
            values: [categoryId] 
        })

        if(!existResult.rows[0].exists){
            return res.status(404).json({error: ` Category not found `})
        }

        const result = await dataBase.query({
            text:`
                SELECT p.id, p.name, p.description, p.price, p.currency, 
                p.quantity, p.active, p.create_date, p.updated_date,
                (SELECT ROW_TO_JSON(category_obj) FROM (
                    SELECT id, name FROM category WHERE id = p.category_id
                ) category_obj) AS category
                
                FROM product p
                where p.category_id  = $1
            `,
            values:[categoryId]
        })


        return res.status(200).json(result.rows)

    }catch(e){
        return res.status(500).json({error:e.message})
    }
}

export const createProduct=async (req,res)=>{
    try{

        const {name, description, price,currency,quantity,active, category_id} =req.body
        if (!name) {
            return res.status(422).json({error:"Name is required"})
        }
        if (!price) {
            return res.status(422).json({error:"price is required"})
        }
        if (!category_id) {
            return res.status(422).json({error:"category_id is required"})
        }else{

            const existResult=await dataBase.query({
                text: `
                select exists (select * from category where id =$1)
            `,
                values: [category_id] 
            })

            if(!existResult.rows[0].exists){
                return res.status(409).json({error: ` Product not found `})
            }
        }

        
        const result= await dataBase.query(
            {
                text: `insert into product(name, description, price,currency,quantity,active, category_id) 
                        values ($1,$2,$3,$4,$5,$6,$7) 
                        returning *`,
                values:
                    [
                        name,
                        description ? description : null, 
                        price,
                        currency ? currency : "USD",
                        quantity ? quantity :0,
                        active ? active :true, 
                        category_id
                    ]
            }
        )
        return res.status(200).json(result.rows[0]);

    }catch(e){
        return res.status(500).json({error:e.message});
    }
}

export const updateProduct = async(req,res)=>{
    try{

        const {name, description, price,currency,quantity,active, category_id}=req.body
        const id=req.params.id

        if (!name || !description || !price || !currency|| !quantity || !active || !category_id) {
            return res.status(422).json({error:"All fields are required"})
        }
        
        const result=await dataBase.query({
            text:`
                update product
                set name =$1,description=$2, price=$3,currency=$4,quantity=$5,active=$6, category_id=$7, updated_date = current_timestamp
                where id=$8
                returning *
            `,
            values: 
                [
                    name,
                    description, 
                    price,
                    currency,
                    quantity,
                    active, 
                    category_id,
                    id
                ] 
        })

        if(result.rowCount==0){
            return res.status(404).json({error:'Product not found'})
        }
        
        return res.status(200).json(result.rows[0])

    }catch(err){
        return res.status(500).json({error:err.message});
    }
}

export const deleteProduct = async (req, res) => {
    try {

        const id=req.params.id
        const result = await dataBase.query({
            text: 'DELETE FROM product WHERE id = $1',
            values: [id]
        })

        if (result.rowCount == 0) {
            return res.status(404).json({ error: 'Product not found' })
        }

        return res.status(204).json({message:"delete success"})
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}