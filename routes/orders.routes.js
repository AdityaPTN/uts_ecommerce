const express = require('express');
const router = express.Router();
const Order = require('../models/orders.models');
const History = require('../models/historys.models');


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

router.post('/orders/add_to_history',(req,res)=>{
    let id = req.body.id;
    const history = new History({
        product_list: req.body.product_list,
        total: req.body.total,
    });
    history.save((err) =>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        } else {
            req.session.message = {
                type: 'success',
                message: 'Order Taken Approve!',
            };
            res.redirect(`/orders/delete/${id}`)
        }
    })
})

router.get('/orders/delete/:id', (req,res)=>{
    let id = req.params.id;
    Order.findByIdAndRemove(id, (err, result) => {
        if(err){
            res.json({message: err.message});
        } else{
            req.session.message = {
                type: 'info',
                message: 'Order Taken Approve!'
            }
            res.redirect('/orders');
        }
    })
})

module.exports = router;