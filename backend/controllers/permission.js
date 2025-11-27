const {Permission} = require('../models')

const getAll = async (req, res) => {
    try {
        let {page, row, id} = req.query
    
        const where = {}
    
        if (id) {
            where.id = id
        }
    
        const options = {
            where,
            order: [
                ['description', 'DESC']
            ]
        }
        if (page) options.offset = parseInt(page);
        if (row) options.limit = parseInt(row) || 10;
        const getAll = await Permission.findAndCountAll(options);
        return res.status(200).json({
            data: getAll
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

const addPermission = async (req, res) => {
    try {
        const {name, description} = req.body;
        const permissionData = {
            name,
            description
        }
        const addPermission = await Permission.create(permissionData);
        return res.status(200).json({
            data: addPermission
        })
    } catch (error) {
        return res.status(404).json({
            message: error.message
        })
    }
}

const editPermission = async (req, res) => {
    try {
        const {name, description} = req.body;
        const {id} = req.params;
        const cariPermission = await Permission.findByPk(id);
        if (!cariPermission) {
        return res.status(400).json({
            message: 'Product tidak ditemukan'
        })
        }
        if (name != cariPermission.name) {
            cariPermission.name = name
        }
        if (description != cariPermission.description) {
            cariPermission.description = description
        }
        const editPermission = await cariPermission.save()
        return res.status(200).json({
            data: editPermission
        })
    } catch (error) {
        return res.status(400).json({
            message: 'Gagal update'
        })
    }
}

const deletePermission = async (req, res) => {
    try {
        const {id} = req.params;
        const cariPermission = await Permission.findByPk(id);
        const delPermission = await cariPermission.destroy();
        return res.status(200).json({
            data: cariPermission
        })
    } catch (error) {
        return res.status(400).json({
            message: 'Gagal hapus'
        })
    }
}

module.exports = {
    getAll,
    addPermission,
    editPermission,
    deletePermission
}