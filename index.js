const express = require('express');
// const mongoose=require('mongoose');
const cors = require('cors');

require('./db/config');
const User = require("./db/User");
const Product = require("./db/Product");

const Jwt = require('jsonwebtoken');
const jwtkey = 'e-comm';


const app = express();
app.use(express.json());  //as a middleware used
app.use(cors());          //as a middleware used core()

// const connectDB= async ()=>{
// mongoose.connect('mongodb://127.0.0.1:27017/e-comm');
// const productSchema=new mongoose.Schema({});
// const product=mongoose.model('products',productSchema);
// const data = await product.find();
// console.log(data);




// }
// connectDB();

app.post("/register", async (req, resp) => {
    // resp.send("api in progress");
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password
    // resp.send(req.body);
    // resp.send(result);
     const token = Jwt.sign({ result }, jwtkey, { expiresIn: "2h" })
       
     resp.send({result, auth: token})
})

app.post("/login", async (req, resp) => {
    console.log(req.body)
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");

        if (user) {

            const token = Jwt.sign({ user }, jwtkey, { expiresIn: "2h" })
       
            re
            
           
           
            
          
            // resp.send(user);
        }

        else {
            resp.send({ result: 'No User Found' })
        }

    }
    else {
        resp.send({ result: 'No User Found' })
    }
    // let user = await User.findOne(req.body).select("-password");
    // // resp.send(req.body)
    // if(user)
    // {
    //     resp.send(user);
    // }
    // // resp.send(user);
    // else
    // {
    //     resp.send({result:'No User Found'})
    // }
})

app.post('/add-product', verifyToken,async (req, resp) => {
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result);
})

app.get('/products',verifyToken, async (req, resp) => {
    let products = await Product.find();
    if (products.length > 0) {
        resp.send(products);
    } else {
        resp.send({ result: "No Products found" })
    }

})

app.delete('/product/:_id',verifyToken, async (req, resp) => {
    //   resp.send(req.params.id);
    const result = await Product.deleteOne({ _id: req.params._id });
    resp.send(result);
})

app.get("/product/:_id",verifyToken, async (req, resp) => {
    let result = await Product.findOne({ _id: req.params._id });
    if (result) {
        resp.send(result)
    } else {
        resp.send({ result: "No Record Found" })
    }
})

app.put("/product/:_id",verifyToken, async (req, resp) => {
    let result = await Product.updateOne(
        { _id: req.params._id },
        {
            $set: req.body
        }
    )
    resp.send(result);

})

app.get("/search/:key", verifyToken, async (req, resp) => {
    let result = await Product.find({
        "$or": [
            { name: { $regex: req.params.key } },
            { company: { $regex: req.params.key } },
            { category: { $regex: req.params.key } },
            { price: { $regex: req.params.key } }
        ]
    });
    resp.send(result);
})
//this is middleware function which is used the three parameter generally,next used to verify the token on any api
//next() function used after loading problem has been resolved
function verifyToken(req, resp, next) {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split(' ')[1];
        // console.warn("middleware called if", token)
        Jwt.verify(token, jwtkey, (err, valid) => {
            if (err) {
                resp.status(401).send({ result: "Please Provide valid token" })
            } else {
                next();
            }
        })

    } else {
        resp.status(403).send({ result: "Please add token with header" })
    }
    // console.warn("middleware called",token);
    // next();
}

app.listen(5000);