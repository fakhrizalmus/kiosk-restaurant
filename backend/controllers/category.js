const {Category} = require('../models')

const getCategory = async (req, res) => {
    try {
        let {page, row, id} = req.query
    
        const where = {}
    
        if (id) {
            where.id = id
        }
    
        const options = {
            where,
            order: [
                ['name', 'DESC']
            ]
        }
        if (page) options.offset = parseInt(page);
        if (row) options.limit = parseInt(row) || 10;
    
        const getCategory = await Category.findAndCountAll(options)
        return res.status(200).json({
            data: getCategory
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

const addCategory = async (req, res) => {
    try {
        const {name} = req.body
        const categoryData = {
            name: name
        }
        const addCategory = await Category.create(categoryData)
        return res.status(200).json({
            data: addCategory
        })
    } catch (error) {
        return res.status(404).json({
            message: error.message
        })
    }
}

const updateCategory = async (req, res) => {
    const {id} = req.params
    const {name} = req.body
    const cariCategory = await Category.findByPk(id)
    if (!cariCategory) {
        return res.status(400).json({
            message: 'Category tidak ditemukan'
        })
    }
    if (name != cariCategory.name) {
        cariCategory.name = name
    }
    const updateCategory = await cariCategory.save()
    if (updateCategory) {
        return res.status(200).json({
            data: updateCategory
        })
    } else {
        return res.status(400).json({
            message: 'Gagal update'
        })
    }
}

const deleteCategory = async (req, res) => {
    const {id} = req.params
    const cariCategory = await Category.findByPk(id)
    if (cariCategory) {
        const deleteCategory = await cariCategory.destroy()
        return res.status(200).json({
            data: cariCategory
        })
    } else {
        return res.status(400).json({
            message: 'Gagal hapus'
        })
    }
}

module.exports = {
    getCategory,
    addCategory,
    updateCategory,
    deleteCategory
}