const { productModel } = require('../db/modelServiceProvider');
module.exports = class ProductController {
    #request;
    #response;
    constructor(req,res) {
        this.#request = req
        this.#response = res;
    }

    async saveProduct() {
        try {
            let product = new productModel(this.#request.body);
            let result = null;
            
            if(this.#request.body.id) {
                result = await productModel.updateOne({_id:this.#request.body.pid},{$set: {
                    name:product.name,
                    category: product.category,
                    company:product.company
                }});
            } else {
                result = await product.save();
            }
            if(result) {
                return this.#response.send(JSON.stringify({success:true, message:"Product save successfully", data:result}));
            } else {
                return this.#response.send(JSON.stringify({success:false, message:"Product not saved yet", data:result}));    
            }
        } catch (error) {
            return this.#response.send(JSON.stringify({success:false, message:error.message, data:""}));
        }
    }

    async showProducts() {
        try {
            let product = productModel.find();
            return this.#response.send(JSON.stringify({success: true, message:'Record found', data:await product}))
        } catch (error) {
            return this.#response.send(JSON.stringify({success:false, message:error.message, data:""}));
        }
    }

    async searchProduct() {
        try {
            let product = await productModel.find({
                "$or": [
                    {name:{$regex:this.#request.body.name}},
                    {company:{$regex:this.#request.body.name}}
                ]
            });
            if(product) {
                return this.#response.send(JSON.stringify({success: true, message:'Record found', data:product}))
            } else {
                return this.#response.send(JSON.stringify({success: true, message:'Product Not Found', data:""}))
            }
        } catch (error) {
            return this.#response.send(JSON.stringify({success:false, message:error.message, data:""}));
        }
    }

    async deleteProduct() {
        try {
            let product = await productModel.deleteOne({_id:this.#request.pid})
            if(product) {
                return this.#response.send(JSON.stringify({success: true, message: 'Product Delete', data:product}));
            } else {
                return this.#response.send(JSON.stringify({success: false, message: 'Product Not Deleted Yet', data:""}));
            }
        } catch (error) {
            return this.#response.send(JSON.stringify({success: true, message: error.message, data:""}));
        }
    }
 }