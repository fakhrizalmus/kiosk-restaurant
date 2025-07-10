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