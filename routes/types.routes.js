const express = require('express');
const router = express.Router();
const Type = require('../models/types.models');
const Category = require('../models/categories.models');

router.get('/types', (req, res)=>{
    Type.find().exec((err, types)=>{
        if(err){
            res.json({ message: err.message});
        } else {
            res.render('admin/types/types', {
                title: 'Type List',
                types: types,
            })
        }
    })
})

router.get('/types/add', (req,res)=>{
    Category.find().exec((err,categories)=>{
        if(err){
            res.redirect('/types')
        }else{
            if(categories == null){
                res.redirect('/types');
                console.log(categories)
            }else{
                res.render('admin/types/add_type', {
                    title: "Add Type",
                    categories: categories,
                })
            }
        }
    })
})

router.post('/types/add',(req, res)=>{
    const type = new Type({
        name: req.body.name,
        category_name: req.body.category_name,
    });
    type.save((err) =>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        } else {
            req.session.message = {
                type: 'success',
                message: 'Type added successfully!',
            };
            res.redirect('/types')
        }
    })
});

router.get('/types/edit/:id', (req, res)=>{
    let id = req.params.id;
    Type.findById(id, (err,type)=>{
        if(err){
            res.redirect('/types')
        }else{
            if(type == null){
                res.redirect('/types');
            }else{
                res.render('admin/types/edit_type', {
                    title: "Edit Type",
                    type: type,
                })
            }
        }
    })
})

router.post('/types/update/:id', (req, res) =>{
    let id = req.params.id;
    Type.findByIdAndUpdate(id, {
        name: req.body.name,
    }, (err, result)=>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        } else {
            req.session.message = {
                type: 'success',
                message: 'Type updated successfully!',
            };
            res.redirect('/types')
        }
    })
})

router.get('/types/delete/:id', (req,res)=>{
    let id = req.params.id;
    Type.findByIdAndRemove(id, (err, result) => {
        if(err){
            res.json({message: err.message});
        } else{
            req.session.message = {
                type: 'info',
                message: 'Type deleted successfully!'
            }
            res.redirect('/types');
        }
    })
})

module.exports = router;