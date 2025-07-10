const {Product} = require('../models')
const model = require('../models')

const getAllProduct = async (req, res) => {
    try {
        let {page, row, category_id} = req.query
    
        const where = {}
    
        if (category_id) {
            where.category_id = category_id
        }
    
        const options = {
            include: [
                {
                    model: model.Category
                }
            ],
            where,
            order: [
                ['name', 'DESC']
            ]
        }
        if (page) options.offset = parseInt(page);
        if (row) options.limit = parseInt(row) || 10;
    
        const getAllProduct = await Product.findAll(options)
        return res.status(200).json({
            data: getAllProduct
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

const addProduct = async (req, res) => {
    try {
        const {category_id, name, price} = req.body
        const productData = {
            category_id: category_id,
            name: name,
            price: price
        }
        const addProduct = await Product.create(productData)
        return res.status(200).json({
            data: productData
        })
    } catch (error) {
        return res.status(404).json({
            message: error.message
        })
    }
}

module.exports = {
    getAllProduct,
    addProduct
}