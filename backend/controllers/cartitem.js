const {CartItem} = require('../models')

const getCartItem = async (req, res) => {
    try {
        let {page, row, cart_id, product_id, status} = req.query
        const where = {}

        if (cart_id) {
            where.cart_id = cart_id
        }

        if (product_id) {
            where.product_id = product_id
        }

        if (status) {
            where.status = status
        }

        const options = {
            include: [
                {model: model.Cart},
                {model: model.Product}
            ],
            where,
            order: [
                ['createdAt', 'DESC']
            ]
        }

        if (page) options.offset = parseInt(page);
        if (row) options.limit = parseInt(row) || 10;

        const getCartItem = await CartItem.findAll(options)
        return res.status(200).json({
            data: getCartItem
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

const addCartItem = async (req, res) => {
    try {
        const {cart_id, product_id} = req.body
        const CartItemData = {
            cart_id: cart_id,
            product_id: product_id
        }

        const addCartItem = await CartItem.create(CartItemData)
        return res.status(200).json({
            data: CartItemData
        })
    } catch (error) {
        return res.status(404).json({
            message: error.message
        })
    }
}

const updateCartItem = async (req, res) => {
    const {id} = req.params
    const {product_id, qty, status} = req.body
    const cariCartItem = await CartItem.findByPk(id)
    if (!cariCartItem) {
        return res.status(400).json({
            message: 'CartItem tidak ditemukan'
        })
    }
    if (product_id != cariCartItem.product_id) {
        cariCartItem.product_id = product_id
    }
    if (status != cariCartItem.status) {
        cariCartItem.status = status
    }
    if (qty != cariCartItem.qty) {
        cariCartItem.qty = qty
    }
    const updateCartItem = await cariCartItem.save()
    if (updateCartItem) {
        return res.status(200).json({
            data: updateCartItem
        })
    } else {
        return res.status(400).json({
            message: 'Gagal update'
        })
    }
}

const deleteCartItem = async (req, res) => {
    const {id} = req.params
    const cariCartItem = await CartItem.findByPk(id)
    if (cariCartItem) {
        const deleteCartItem = await cariCartItem.destroy()
        return res.status(200).json({
            data: cariCartItem
        })
    } else {
        return res.status(400).json({
            message: 'Gagal hapus'
        })
    }
}

module.exports = {
    getCartItem,
    addCartItem,
    updateCartItem,
    deleteCartItem
}