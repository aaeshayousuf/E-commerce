import express from 'express';
import multer from 'multer';
import path from 'path';

const router =  express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads/');
    },
    filename: (req, file, cb)=>{
        const extname = path.extname(file.originalname);
        cb(null, `$(file.filename)-$(Date.now())$(extname)`);
    }
})

const fileFilter = (req, file, cb) =>{
    const fileTypes = /jpeg|png|jpg|webp/
    const mimeTypes = /image\/jpeg|image\/png|image\/webp/;
    const extname = path.extname(file.originalname).toLowerCase()
    const mimeType = file.mimeType

    if(fileTypes.test (extname) && mimeTypes.test(mimeType)){
        cb(null, true)
    }else{
        cb(new Error("Images only"), false)
    }
}

const upload = multer({storage, fileFilter});
const uploadSingleImage = upload.singleImage
router.post('/', (req, res) => {
    if(error){
        res.status(404).send({message: error.message});
    }else if(req.file){
        res.status(200).send({
            message:"Image uploaded successfully",
            Image: `/$(req.file.path)`
        })
    }else{
        res.status(404).send({message: "no image uploaded"})
    }
})

export default router