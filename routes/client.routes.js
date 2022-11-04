const express = require('express');
const router = express.Router();
const session = require('express-session')
const Product = require('../models/products.models');
const Order = require('../models/orders.models');
const app = express();

app.use(session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false,
}));

const isProductInCart = (cart, id)=> {
    for(let i=0;i<cart?.length;i++){
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

// generate Code
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const generateCode = ()=>{
    let result = '';
    let length = 6;
    const charactersLength = characters.length;
    for (let i=0; i<length;i++){
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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

router.post('/cart/edit-quantity', (req,res)=>{
    var id = req.body.id;
    var quantity = req.body.quantity;
    var increase_btn = req.body.increase_quantity;
    var decrease_btn = req.body.decrease_quantity;

    var cart = req.session.cart;

    if(increase_btn){
        for(let i=0;i<cart.length;i++){
            if(cart[i].id == id){
                if(cart[i].quantity > 0){
                    cart[i].quantity = parseInt(cart[i].quantity)+1;
                }
            }
        }
    }

    if(decrease_btn){
        for(let i=0;i<cart.length;i++){
            if(cart[i].id == id){
                if(cart[i].quantity > 1){
                    cart[i].quantity = parseInt(cart[i].quantity)-1;
                }
            }
        }
    }

    calculateTotal(cart,req);
    res.redirect('/cart')

})

router.post('/cart/checkout',(req,res)=>{
    const order = new Order({
        product_list: req.body.product_list,
        total: req.body.total,
        status: "Approve Order",
        code: generateCode(),
    });
    order.save((err)=>{
        if(err){
            res.json({message:err.message, type: 'danger'})
        }else{
            req.session.message = {
                type: 'success',
                message: 'Checkout Succeccfully'
            }
            res.redirect('/cart/success');
        }
    })
})

router.get('/cart/success',(req,res)=>{
    Order.find().exec((err, order)=>{
        res.render('client/cart-success',{
            order:order,
        })
    })
})

router.get('/cart/code/:id', (req,res)=>{
    let id = req.params.id;
    Order.findById(id, (err,order)=>{
        if(err){
            res.redirect('/cart')
        }
    })
})

module.exports = router;