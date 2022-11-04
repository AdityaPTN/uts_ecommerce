const express = require('express');
const router = express.Router();
const Order = require('../models/orders.models');

router.get('/admin',(req,res)=>{
    res.render('admin/index',{title: 'Dashboard'})
})

router.get('/orders',(req,res)=>{
    Order.find().exec((err,orders)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.render('admin/orders/orders',{
                title: 'Order List',
                orders:orders,
            })
        }
    })
})

router.post('/orders/update/:id',(req,res)=>{
    let id = req.params.id;
    Order.findByIdAndUpdate(id, {
        product_list: req.body.product_list,
        total: req.body.total,
        status: req.body.status,
        code: req.body.code,
    }, (err,result)=>{
        if(err){
            res.json({message: err.message, type:'danger'})
        } else {
            req.session.message = {
                type: 'success',
                message: 'Status changed!'
            };
            res.redirect('/orders')
        }
    })
})

module.exports = router;