const {Cart} = require('../models')
const model = require('../models')

const getPesanan = async (req, res) => {
    try {
        let {page, row, status, id, table_id, no_table} = req.query
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
            include: [
                {
                    model: model.CartItem,
                    include: [
                        {model: model.Product}
                    ]
                }
            ],
            where,
            order: [
                ['id', 'DESC']
            ]
        }

        if (page) options.offset = parseInt(page);
        if (row) options.limit = parseInt(row) || 10;

        const getCart = await Cart.findAndCountAll(options)
        return res.status(200).json({
            data: getCart
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

module.exports = {
    getPesanan
}