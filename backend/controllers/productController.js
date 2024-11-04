import catchAsync from "../utils/catchAsync.js";
import Product from "../models/productModel.js";

export const addProduct = catchAsync(async(req, res)=> {
    try{
        const {name, description, price, category, quantity, brand, image} = req.fields;

        //validation
        switch(true){
            case !name:
                return res.json({error:"Name is required"});
            case !description:
                return res.json({error:"Description is required"});
            case !price:
                return res.json({error:"Price is required"});
            case !category:
                return res.json({error:"Category is required"});
            case !quantity:
                return res.json({error:"Quantity is required"});
            case !brand:
                return res.json({error:"Brand is required"});
            case !image:
                return res.json({error:"Image is required"});
        }
        //check for existing product

        const oldProduct = await Product.findOne({name})
        if(oldProduct){
            res.status(200).json({message: "Product already exists, please change its name"});
        }

        const product = new Product({...req.fields}); //spread operator
        await product.save();
        return res.status(201).json(product);
    }catch(error){
        console.log(error);
        res.status(400).json(error.message);
    };
})

export const updateProduct =catchAsync(async (req, res) =>{
    try{
        const {name, description, price, category, quantity, brand, image} = req.fields;
        //validation
        switch(true){
            case !name:
                return res.json({error:"Name is required"});
            case !description:
                return res.json({error:"Description is required"});
            case !price:
                return res.json({error:"Price is required"});
            case !category:
                return res.json({error:"Category is required"});
            case !quantity:
                return res.json({error:"Quantity is required"});
            case !brand:
                return res.json({error:"Brand is required"});
            case !image:
                return res.json({error:"Image is required"});
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {...req.fields},
            {new: true}
        );

        await updatedProduct.save();
        return res.status(200).json(updatedProduct);

    }catch(error){
        console.log(error);
        res.status(404).json(error.message);
    }
})

export const removeProduct = catchAsync(async (req, res) =>{
    try{
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedProduct);
    }catch(error){
        console.log(error);
        res.status(404).json(error.message);
    }
});

export const fetchProduct = catchAsync(async (req, res) => {
    try{
        const pageSize = 6;
        const page = Number(req.query.page) || 1; // default to first page
        const keyword = req.query.keyword
        ? { name: {$regex: req.query.keyword, $options: "i"}}
        : {};

        const count = await Product.countDocuments({...keyword});
        const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1));

        res.json({
            products,
            page,
            pages: Math.ceil(count / pageSize),
            hasMore: page < Math.ceil(count / pageSize), // to determine if more pages exist
        })
    }catch(error){
        console.log(error);
        res.status(400).json(error.message);
    }
});

export const fetchAllProducts = catchAsync(async (req, res) => {
    try{
        const products = await Product.find({}).populate('category').limit(12).sort({createdAt: -1});
        res.json(products)
    }catch(error){
        console.log(error);
        res.status(400).json(error.message);
    }
});

export const fetchProductById = catchAsync(async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        if(product){
            res.json(product);
        }else{
            res.status(404).json({message: 'Product not found'});
        }
    }catch(error){
        console.log(error);
        res.status(400).json(error.message);
    }
});

export const addProductReview = catchAsync(async (req, res) => {
    try{
        const {rating, comment} = req.body;
        const product = await Product.findById(req.params.id);
        if(product){
            const alreadyReviewed = product.reviews.find(
                (rating)=> rating.user.toString() === req.user._id.toString()
            );
            if(alreadyReviewed){
                res.status(400).json({message: 'product already reviewed'})
            }

            const newReview = {
                name: req.user.username,
                rating: Number(rating),
                comment,
                user: req.user._id,
            }

            product.reviews.push(newReview);
            product.numReviews = product.reviews.length;
            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
            await product.save();
            res.status(201).json({
                message: 'Review added successfully',
                review: newReview,
                product
            })
        }else{
            res.status(404).json({message: 'Product not found'});
        }
    }catch(error){
        console.log(error);
        res.status(400).json(error.message);
    }
});

export const fetchTopProduct = catchAsync(async (req, res) => {
    try{
        const products = await Product.find({}).sort({rating: -1}).limit(4);
        res.json(products);
    }catch(error){
        console.log(error);
        res.status(400).json(error.message);
    }
});
export const fetchNewProduct = catchAsync(async (req, res) => {
    try{
        const products = await Product.find({}).sort({_id: -1}).limit(5);
        res.json(products);
    }catch(error){
        console.log(error);
        res.status(400).json(error.message);
    }
});