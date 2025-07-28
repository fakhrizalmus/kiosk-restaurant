const {Transaction, Cart} = require('../models')
const model = require('../models');

const getTransaction = async (req, res) => {
    try {
        // let user_id = req.user.id
        let {page, row, cart_id, total, paid_at} = req.query
        const where = {}

        if (cart_id) {
            where.cart_id = cart_id
        }

        if (total) {
            where.total = total
        }

        if (paid_at) {
            where.paid_at = paid_at
        }

        // where.user_id = user_id

        const options = {
            include: [
                {model: model.Cart},
                // {model: model.User}
            ],
            where,
            order: [
                ['createdAt', 'DESC']
            ]
        }

        if (page) options.offset = parseInt(page);
        if (row) options.limit = parseInt(row) || 10;

        const getTransaction = await Transaction.findAndCountAll(options)
        return res.status(200).json({
            data: getTransaction
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

const addTransaction = async (req, res) => {
    try {
        const {cart_id, total} = req.body
        const TransactionData = {
            cart_id: cart_id,
            total: total,
            paid_at: new Date()
        }

        const addTransaction = await Transaction.create(TransactionData)
        return res.status(200).json({
            data: addTransaction
        })
    } catch (error) {
        return res.status(404).json({
            message: error.message
        })
    }
}

const updateTransaction = async (req, res) => {
    const {id} = req.params
    const {cart_id, total, paid_at} = req.body
    const cariTransaction = await Transaction.findByPk(id)
    if (!cariTransaction) {
        return res.status(400).json({
            message: 'Transaction tidak ditemukan'
        })
    }
    if (cart_id != cariTransaction.cart_id) {
        cariTransaction.cart_id = cart_id
    }
    if (paid_at != cariTransaction.paid_at) {
        cariTransaction.paid_at = paid_at
    }
    if (total != cariTransaction.total) {
        cariTransaction.total = total
    }
    const updateTransaction = await cariTransaction.save()
    if (updateTransaction) {
        return res.status(200).json({
            data: updateTransaction
        })
    } else {
        return res.status(400).json({
            message: 'Gagal update'
        })
    }
}

const deleteTransaction = async (req, res) => {
    const {id} = req.params
    const cariTransaction = await Transaction.findByPk(id)
    if (cariTransaction) {
        const deleteTransaction = await cariTransaction.destroy()
        return res.status(200).json({
            data: cariTransaction
        })
    } else {
        return res.status(400).json({
            message: 'Gagal hapus'
        })
    }
}

const getTransactionCart = async (req, res) => {
    try {
        // let user_id = req.user.id
        let {page, row, id, no_table} = req.query
        const where = {}

        if (id) {
            where.id = id
        }

        if (no_table) {
            where.no_table = no_table
        }

        // where.user_id = user_id

        const options = {
            include: [
                {model: model.Transaction},
                // {model: model.User},
                {
                    model: model.CartItem,
                    include: [
                        {model: model.Product}
                    ]
                }
            ],
            where,
            order: [
                ['createdAt', 'DESC']
            ]
        }

        if (page) options.offset = parseInt(page);
        if (row) options.limit = parseInt(row) || 10;

        const getTransaction = await Cart.findAndCountAll(options)
        return res.status(200).json({
            data: getTransaction
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

module.exports = {
    getTransaction,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionCart
}