import api from '@/lib/axios'

export async function getInfoLogin() {
    const res = await api.get(`/auth/me`)
    return res.data
}

export async function getRoles(params: { id: any }) {
    const res = await api.get(`/role`, {
        params: params || {},
    })
    return res.data.data.rows[0]
}