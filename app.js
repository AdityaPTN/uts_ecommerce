require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const session = require('express-session')
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT;

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('err', (err)=> console.log(err));
db.once('open', ()=> console.log('connect'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static('uploads'));
app.use(express.static('public'));
app.use(session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false,
}));

app.use((req, res, next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.set('view engine', 'ejs');

app.use('', require('./routes/products.routes'))
app.use('', require('./routes/categories.routes'))
app.use('', require('./routes/types.routes'))
app.use('', require('./routes/client.routes'))

app.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}`)
})