import pkg from 'pg';
import dotenv from 'dotenv'
dotenv.config();

const { Pool } = pkg;
 
export const dataBase = new Pool({
  connectionString:process.env.DATA_BASE_URL
})
