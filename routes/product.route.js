import express from 'express';
import { getAllProducts,getProductById,getProductByCategoryId,createProduct,updateProduct ,deleteProduct} from '../controllers/product.controller.js';
const productRoutes=express.Router();

productRoutes.get('/',getAllProducts);
productRoutes.post('/',createProduct);
productRoutes.route(':id')
        .patch(updateProduct)
        .delete(deleteProduct)
        .get(getProductById)
productRoutes.get("/category/:categoryId",getProductByCategoryId)

export default productRoutes