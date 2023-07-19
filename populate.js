require('dotenv').config()

const connectDB = require('./db/connect')
const product = require('./models/product')

const JsonProducts = require('./products.json')


const start = async (req,res)=>{
  try{
    await connectDB(process.env.MONGO_URI)
    await product.deleteMany();
    await product.create(JsonProducts);
    console.log("success")
    process.exit(0);
  }
  catch(error){
    console.log(error)
    process.exit(1);
  }  
}


start();