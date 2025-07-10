const {Product} = require('../models')
const model = require('../models')

const getProduct = async (req, res) => {
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
    
        const getProduct = await Product.findAll(options)
        return res.status(200).json({
            data: getProduct
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

const updateProduct = async (req, res) => {
    const {id} = req.params
    const {category_id, name, price} = req.body
    const cariProduct = await Product.findByPk(id)
    if (!cariProduct) {
        return res.status(400).json({
            message: 'Product tidak ditemukan'
        })
    }
    if (category_id != cariProduct.category_id) {
        cariProduct.category_id = category_id
    }
    if (name != cariProduct.name) {
        cariProduct.name = name
    }
    if (price != cariProduct.price) {
        cariProduct.price = price
    }
    const updateProduct = await cariProduct.save()
    if (updateProduct) {
        return res.status(200).json({
            data: updateProduct
        })
    } else {
        return res.status(400).json({
            message: 'Gagal update'
        })
    }
}

const deleteProduct = async (req, res) => {
    const {id} = req.params
    const cariProduct = await Product.findByPk(id)
    if (cariProduct) {
        const deleteProduct = await cariProduct.destroy()
        return res.status(200).json({
            data: cariProduct
        })
    } else {
        return res.status(400).json({
            message: 'Gagal hapus'
        })
    }
}

module.exports = {
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct
}