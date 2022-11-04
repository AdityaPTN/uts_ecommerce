const express = require('express');
const router = express.Router();
const session = require('express-session')
const Product = require('../models/products.models');
const app = express();

app.use(session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false,
}));

const isProductInCart = (cart, id)=> {
    for(let i=0; i<cart.length;i++){
        if(cart[i].id == id){
            return true;
        }
    }
    return false;
}

const calculateTotal = (cart,req)=>{
    total = 0;
    for(let i=0;i<cart.length;i++){
        total = total + (cart[i].price*cart[i].quantity);
    }
    req.session.total = total;
    return total;
}

router.get('/', (req,res)=>{
    Product.find().exec((err, products)=>{
        if(err){
            res.json({ message: err.message});
        } else {
            res.render('client/index', {
                style: "homepage",
                barang: products,
            })
        }
    })
})

router.get('/shop/:id', (req,res)=>{
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

router.get('/cart', (req,res)=>{
    var cart = req.session.cart;
    var total = req.session.total;

    res.render('client/cart', {
        cart: cart,
        total: total,
    })
})

router.post('/add_to_cart', (req,res)=>{
    let id = req.body.id;
    let name = req.body.name;
    let price = req.body.price;
    let quantity = req.body.quantity;
    let image = req.body.image;
    let product = {id:id, name:name, price:price, quantity:quantity, image:image};

    if(req.session.cart){
        var cart = req.session.cart;

        if(!isProductInCart()){
            cart.push(product);
        }

    }else{
        req.session.cart = [product];
        var cart = req.session.cart;
    }

    calculateTotal(cart,req);

    res.redirect('/cart');
})

router.post('/cart/remove_product', (req,res)=>{
    var id = req.body.id;
    var cart = req.session.cart;

    for(let i=0;i<cart.length;i++){
        if(cart[i].id == id){
            cart.splice(cart.indexOf(i),1);
        }
    }

    calculateTotal(cart, req);
    res.redirect('/cart')
})

module.exports = router;