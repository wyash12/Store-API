const product = require('../models/product')
const Product = require('../models/product')


const getAllProductsStatic= async (req,res)=>{
    // const {name} = req.query
    // const queryObj ={}

    const products = await Product.find({}).sort('name')
    res.status(200).send({products, nbHits: products.length})
}

const getAllProducts = async(req,res)=>{
    const {featured,company,name, sort, fields,numericFilters} = req.query

    const queryObject = {}
    if(featured){
     

        queryObject.featured = featured === 'true'? true : false 
    }
    if(company)
    {
       
        queryObject.company = company
    }
    if(name)
    {
        queryObject.name = {$regex:name,$options:'i'};
    }
    if (numericFilters) {
        const operatorMap = {
          '>': '$gt',
          '>=': '$gte',
          '=': '$eq',
          '<': '$lt',
          '<=': '$lte',
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(
          regEx,
          (match) => `-${operatorMap[match]}-`
        );
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item) => {
          const [field, operator, value] = item.split('-');
          if (options.includes(field)) {
            queryObject[field] = { [operator]: Number(value) };
          }
        });
      }
    // console.log(queryObject)
    let prods = Product.find(queryObject);

    
    if (sort) {
       
        const sortList = sort.split(',').join(' ')
        prods= prods.sort(sortList)
    }
    else{
        prods= prods.sort('createdAt')
    }

    if(fields)
    {
        const fieldsList = fields.split(',').join(' ')
        prods = prods.select(fieldsList)
    }


    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  
    prods = prods.skip(skip).limit(limit);


    const products = await prods
    res.status(200).send({products,nbHits: products.length})
}

module.exports ={
    getAllProductsStatic,
    getAllProducts
}