const express = require('express');
const keys = require('./config/keys')
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app= express();

//handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout:'main'}));
 
app.set('view engine', 'handlebars');

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Set static folder
app.use(express.static(`${__dirname}/public`));
//charge route
app.post('/charge',(req,res)=>{
        const amount = 2500;
       
        stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,

        })
        .then(customer => stripe.charges.create({
            amount,
            description:"Seo Ebook",
            currency:'usd',
            customer:customer.id

        }))
        .then(charge => res.render('success'));

})

//index route
app.get('/', (req, res)=> {
    res.render('index',{
        stripePublishableKey: keys.stripePublishableKey
    });
});
const port = process.env.PORT || 5000;

app.listen(port, ()=> {
    console.log(`server started on port: ${port}`);
});