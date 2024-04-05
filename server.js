import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import apiRoutes from './routes/api.js'

const app= express()
dotenv.config()
app.use(cors())
app.use(express.json())


app.use("/api", apiRoutes);




const PORT = process.env.PORT || 4001;
app.listen(PORT, (req, res) => {
  console.log(`server is listening on ${PORT}`);
});