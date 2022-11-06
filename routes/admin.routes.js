const express = require('express');
const router = express.Router();
const History = require('../models/historys.models');
const Order = require('../models/orders.models');

router.get('/admin', (req, res)=>{
    History.find().exec((err, data)=>{
        Order.find().exec((err, order)=>{
            if(err){
                res.json({ message: err.message});
            } else {
                res.render('admin/index', {
                    title: 'Dashboard',
                    data: data,
                    order:order,
                })
            }
        })
    })
})

module.exports = router