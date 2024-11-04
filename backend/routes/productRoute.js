import express from 'express';
import formidable from 'express-formidable';
import checkId from '../middlewares/checkId.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeAdmin } from '../middlewares/authorizeAdmin.js';
import { addProduct, addProductReview, fetchAllProducts, fetchNewProduct, fetchProduct, fetchProductById, fetchTopProduct, removeProduct, updateProduct } from '../controllers/productController.js';

const productRouter  = express.Router();

productRouter.post('/',  authenticate, authorizeAdmin, formidable(), addProduct);
productRouter.post('/:id/reviews', authenticate, checkId, addProductReview);

productRouter.put('/:id', authenticate, authorizeAdmin, formidable(), updateProduct);

productRouter.delete('/:id', authenticate, authorizeAdmin, formidable(), removeProduct);

productRouter.get('/', fetchProduct)
productRouter.get('/allproducts', fetchAllProducts)
productRouter.get('/:id', fetchProductById);
productRouter.get('/top', fetchTopProduct);
productRouter.get('/new', fetchNewProduct);

export default productRouter;