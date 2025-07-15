const {Cart} = require('../models')

const getCart = async (req, res) => {
    try {
        let {no_table} = req.params
        let {page, row, status, id, table_id} = req.query
        const where = {}

        if (status) {
            where.status = status
        }

        if (no_table) {
            where.no_table = no_table
        }

        if (table_id) {
            where.no_table = table_id
        }

        if (id) {
            where.id = id
        }

        const options = {
            where,
            order: [
                ['createdAt', 'DESC']
            ]
        }

        if (page) options.offset = parseInt(page);
        if (row) options.limit = parseInt(row) || 10;

        const getCart = await Cart.findAll(options)
        return res.status(200).json({
            data: getCart
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

const addCart = async (req, res) => {
    try {
        const {no_table} = req.body
        const cartData = {
            no_table: no_table
        }

        const addCart = await Cart.create(cartData)
        return res.status(200).json({
            data: addCart
        })
    } catch (error) {
        return res.status(404).json({
            message: error.message
        })
    }
}

const updateCart = async (req, res) => {
    const {id} = req.params
    const {no_table, status} = req.body
    const cariCart = await Cart.findByPk(id)
    if (!cariCart) {
        return res.status(400).json({
            message: 'Cart tidak ditemukan'
        })
    }
    if (no_table != cariCart.no_table) {
        cariCart.no_table = no_table
    }
    if (status != cariCart.status) {
        cariCart.status = status
    }
    const updateCart = await cariCart.save()
    if (updateCart) {
        return res.status(200).json({
            data: updateCart
        })
    } else {
        return res.status(400).json({
            message: 'Gagal update'
        })
    }
}

const deleteCart = async (req, res) => {
    const {id} = req.params
    const cariCart = await Cart.findByPk(id)
    if (cariCart) {
        const deleteCart = await cariCart.destroy()
        return res.status(200).json({
            data: cariCart
        })
    } else {
        return res.status(400).json({
            message: 'Gagal hapus'
        })
    }
}

module.exports = {
    getCart,
    addCart,
    updateCart,
    deleteCart
}