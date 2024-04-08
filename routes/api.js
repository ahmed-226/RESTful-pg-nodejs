import express from 'express';
import categoryRoutes from './category.route.js'
import productRoutes from './product.route.js'
import userRoutes from './user.route.js';


const apiRoutes =express.Router();

apiRoutes.use('/categories',categoryRoutes)
apiRoutes.use('/products',productRoutes)
apiRoutes.use('/users',userRoutes)

export default apiRoutes

