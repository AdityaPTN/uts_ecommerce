const express = require('express');
const router = express.Router();
const Product = require('../models/products.models');
const Type = require('../models/types.models')
const multer = require('multer')
const fs = require('fs');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname+"_" + Date.now() + "_" + file.originalname);
    },
})

var upload = multer({
    storage: storage,
}).single('image');

router.get('/products', (req, res)=>{
    Product.find().exec((err, products)=>{
        if(err){
            res.json({ message: err.message});
        } else {
            res.render('admin/products/products', {
                title: 'Product List',
                products: products,
            })
        }
    })
})


router.get('/products/add', (req,res)=>{
    Type.find().exec((err,types)=>{
        if(err){
            res.redirect('/types')
        }else{
            if(types == null){
                res.redirect('/types');
                console.log(types)
            }else{
                res.render('admin/products/add_product', {
                    title: "Add Product",
                    types: types,
                })
            }
        }
    })
})

router.post('/products/add', upload, (req, res)=>{
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
        description: req.body.description,
        type_name: req.body.type_name,
        image: req.file.filename,
    });
    product.save((err) =>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        } else {
            req.session.message = {
                type: 'success',
                message: 'Product added successfully!',
            };
            res.redirect('/products')
        }
    })
});

router.get('/products/edit/:id', (req, res)=>{
    let id = req.params.id;
    Product.findById(id, (err,product)=>{
        if(err){
            res.redirect('/products')
        }else{
            if(product == null){
                res.redirect('/products');
            }else{
                res.render('admin/products/edit_product', {
                    title: "Edit Product",
                    product: product,
                })
            }
        }
    })
})

router.post('/products/update/:id', upload, (req, res) =>{
    let id = req.params.id;
    let new_image = '';

    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync("uploads/" + req.body.old_image);
        }catch(err){
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }

    Product.findByIdAndUpdate(id, {
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
        description: req.body.description,
        image: new_image,
    }, (err, result)=>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        } else {
            req.session.message = {
                type: 'success',
                message: 'Product updated successfully!',
            };
            res.redirect('/products')
        }
    })
})

router.get('/products/delete/:id', (req,res)=>{
    let id = req.params.id;
    Product.findByIdAndRemove(id, (err, result) => {
        if(result.image != ''){
            try{
                fs.unlinkSync('uploads/'+result.image);
            }catch(err){
                console.log(err);
            }

            if(err){
                res.json({message: err.message});
            } else{
                req.session.message = {
                    type: 'info',
                    message: 'Product deleted successfully!'
                }
                res.redirect('/products');
            }
        }
    })
})

module.exports = router;