import api from '@/lib/axios'

type GetCartParams = {
    page?: number
    row?: number
    id?: number
    status?: string
}

export async function getCart(params: GetCartParams, id: number) {
    const res = await api.get(`/cart/${id}`, {
        params: params || {},
    })
    return res.data
}

type GetProductParams = {
    category_id?: number
}

export async function getProduct(params: GetProductParams) {
    const res = await api.get(`/product`, {
        params: params || {},
    })
    return res.data
}

export async function addCart(data: {
    no_table: number
}) {
    try {
        const res = await api.post("/cart", data)
        return res.data
    } catch (error) {
        console.error("Gagal menyimpan cart", error)
        throw error
    }
}

export async function addCartItem(data: {
    cart_id: number
    product_id: number
    qty: number
}) {
    try {
        const res = await api.post("/cart-item", data)
        return res.data
    } catch (error) {
        console.error("Gagal menyimpan cart item", error)
        throw error
    }
}

export async function deleteCartItem(id: number) {
    try {
        const res = await api.delete(`/cart-item/${id}`)
        return res.data
    } catch (error) {
        throw error
    }
}

export async function updateCartItem(id: number, data: {
    product_id?: number
    qty?: number
    status?: string
}) {
    try {
        const res = await api.put(`/cart-item/${id}`, data)
        return res.data
    } catch (error) {
        console.error("Gagal menyimpan cart item", error)
        throw error
    }
}