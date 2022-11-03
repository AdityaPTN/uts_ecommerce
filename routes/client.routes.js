const express = require('express');
const router = express.Router();
const Product = require('../models/products.models');

router.get('/', (req,res)=>{
    Product.find().exec((err, products)=>{
        if(err){
            res.json({ message: err.message});
        } else {
            res.render('client/index', {
                style: "homepage",
                products: products,
            })
        }
    })
})

router.get('/:id', (req,res)=>{
    let id = req.params.id;
    Product.findById(id, (err,product)=>{
        if(err){
            res.redirect('/');
        }else{
            if(product == null){
                res.redirect('/');
            }else{
                res.render('client/product', {
                    style: "product",
                    product: product,
                })
            }
        }
    })
})

module.exports = router;