import express from 'express';
import { getAllCategories,getCategoryById,createCategory,updateCategory,deleteCategory } from "../controllers/category.controller.js";

const categoryRoutes=express.Router();

categoryRoutes.get('/',getAllCategories);
categoryRoutes.post('/',createCategory);
categoryRoutes.route('/:id')
        .patch(updateCategory)
        .patch(deleteCategory)
        .get(getCategoryById);

export default categoryRoutes