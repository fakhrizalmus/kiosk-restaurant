const {Role} = require('../models')

const getAll = async (req, res) => {
    try {
        const getAll = await Role.findAndCountAll();
        return res.status(200).json({
            data: getAll
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

const addRole = async (req, res) => {
    try {
        const {role, permission} = req.body;
        const roleData = {
            role,
            permission
        }
        const addRole = await Role.create(roleData);
        return res.status(200).json({
            data: addRole
        })
    } catch (error) {
        return res.status(404).json({
            message: error.message
        })
    }
}

const editRole = async (req, res) => {
    try {
        const {role, permission} = req.body;
        const {id} = req.params;
        const cariRole = await Role.findByPk(id);
        if (!cariRole) {
        return res.status(400).json({
            message: 'Product tidak ditemukan'
        })
        }
        if (role != cariRole.role) {
            cariRole.role = role
        }
        if (permission != cariRole.permission) {
            cariRole.permission = permission
        }
        const editRole = await cariRole.save()
        return res.status(200).json({
            data: editRole
        })
    } catch (error) {
        return res.status(400).json({
            message: 'Gagal update'
        })
    }
}

const deleteRole = async (req, res) => {
    try {
        const {id} = req.params;
        const cariRole = await Role.findByPk(id);
        const delRole = await cariRole.destroy();
        return res.status(200).json({
            data: cariRole
        })
    } catch (error) {
        return res.status(400).json({
            message: 'Gagal hapus'
        })
    }
}

module.exports = {
    getAll,
    addRole,
    editRole,
    deleteRole
}