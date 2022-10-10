const express=require("express");
const dotenv=require("dotenv");
const morgan=require("morgan");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const path=require("path");
const stripe = require('stripe')(process.env.Secret_Key);
var Publishable_Key=process.env.Publishable_Key;
var Secret_Key=process.env.Secret_Key;
const app=express();

dotenv.config({path:'.env'});
const PORT=process.env.PORT || 8080;

//log request
app.use(morgan("tiny"));
// parse request to body-parser
app.use(bodyparser.urlencoded({extended: true}));
//set view engine
app.set('view engine','ejs');

app.use(express.static("assets"));


app.get("/",(req,res)=>{
    res.render("form");
});
app.get("/payment",(req,res)=>{
    res.render("payment",{
        key:process.env.Publishable_Key
    });
});
app.post("/payment",(req,res)=>{
    stripe.customers.create({
        email:req.body.stripeEmail,
        source:req.body.stripetoken,
        name:req.body.Username,
        address:{
            line1:"Agartala,Tripura",
            postal_Code:"799008",
            city:"Agartala",
            state:"Tripura",
            country:"India"

        }
    })
    .then((customers)=>{
        return stripe.charges.create({
            amount:1000,
            description:"Wb Development Project",
            currency:"USD",
            customer:customers.id
        })
    })
    .then((charge)=>{
        console.log(charge)
        res.send("Success");
    })
    .catch((err)=>{
        res.send("Error");
    })
})
app.listen(PORT,(req,res)=>{
    console.log("Server Started at port 3000");
})