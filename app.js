require("dotenv").config()
require('express-async-errors')

const express = require('express');
const app = express();

const port = process.env.PORT ||3000
const notFoundMiddleware = require("./middleware/not-found")
const errorHandler = require("./middleware/error-handler")
const mongoURI = process.env.MONGO_URI
const connectDB = require("./db/connect")
const productRouter = require('./routes/products')

app.use(express.json())

//routes

app.get('/',(req,res)=>{
    res.send('<h1>Store Api</h1> <a href="/api/v1/products">products<a/>')
})

app.use('/api/v1/products',productRouter)
//products route

app.use(notFoundMiddleware)
app.use(errorHandler)

const start= async (req,res)=>{
    try{
        await connectDB(mongoURI);
    app.listen(port,console.log(`server is listening on ${port}`));
    }
    catch(error){
        console.log(error)
    }
}


start()