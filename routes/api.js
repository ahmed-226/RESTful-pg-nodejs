import express from 'express';
import categoryRoutes from './category.route.js'
import productRoutes from './product.route.js'


const apiRoutes =express.Router();

apiRoutes.use('/categories',categoryRoutes)
apiRoutes.use('/products',productRoutes)

export default apiRoutes

