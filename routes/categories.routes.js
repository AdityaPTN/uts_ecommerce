const express = require('express');
const router = express.Router();
const Category = require('../models/categories.models');

router.get('/categories', (req, res)=>{
    Category.find().exec((err, categories)=>{
        if(err){
            res.json({ message: err.message});
        } else {
            res.render('admin/categories/categories', {
                title: 'Category List',
                categories: categories,
            })
        }
    })
})

router.get('/categories/add', (req,res)=>{
    res.render('admin/categories/add_category', {title: 'Add Category'})
})

router.post('/categories/add',(req, res)=>{
    const category = new Category({
        name: req.body.name,
    });
    category.save((err) =>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        } else {
            req.session.message = {
                type: 'success',
                message: 'Category added successfully!',
            };
            res.redirect('/categories')
        }
    })
});

router.get('/categories/edit/:id', (req, res)=>{
    let id = req.params.id;
    Category.findById(id, (err,category)=>{
        if(err){
            res.redirect('/categories')
        }else{
            if(category == null){
                res.redirect('/categories');
            }else{
                res.render('admin/categories/edit_category', {
                    title: "Edit Category",
                    category: category,
                })
            }
        }
    })
})

router.post('/categories/update/:id', (req, res) =>{
    let id = req.params.id;
    Category.findByIdAndUpdate(id, {
        name: req.body.name,
    }, (err, result)=>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        } else {
            req.session.message = {
                type: 'success',
                message: 'Category updated successfully!',
            };
            res.redirect('/categories')
        }
    })
})

router.get('/categories/delete/:id', (req,res)=>{
    let id = req.params.id;
    Category.findByIdAndRemove(id, (err, result) => {
        if(err){
            res.json({message: err.message});
        } else{
            req.session.message = {
                type: 'info',
                message: 'Category deleted successfully!'
            }
            res.redirect('/categories');
        }
    })
})

module.exports = router;