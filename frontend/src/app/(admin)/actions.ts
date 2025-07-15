import api from '@/lib/axios'

//cart
type GetCartParams = {
    page?: number
    row?: number
    id?: number
    status?: string
    table_id?: number
}

export async function getCart(params: GetCartParams, no_table: number) {
    const res = await api.get(`/cart/${no_table}`, {
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

export async function updateCart(data: {
    no_table?: number
    status?: string
}, id: number) {
    try {
        const res = await api.put(`/cart/${id}`, data)
        return res.data
    } catch (error) {
        console.error("Gagal update cart", error)
        throw error
    }
}

export async function deleteCart(id: number) {
    try {
        const res = await api.delete(`/cart/${id}`)
        return res.data
    } catch (error) {
        throw error
    }
}

//product

type GetProductParams = {
    category_id?: number
    page?: number
    row?: number
    id?: number
}

export async function getProduct(params: GetProductParams) {
    const res = await api.get(`/product`, {
        params: params || {},
    })
    return res.data
}

export async function addProduct(data: {
    category_id: number
    name: string
    price: number
    image: string
}) {
    try {
        const res = await api.post("/product", data)
        return res.data
    } catch (error) {
        console.error("Gagal menyimpan product", error)
        throw error
    }
}

export async function updateProduct(data: {
    category_id?: number
    name?: string
    price?: number
}, id: number) {
    try {
        const res = await api.put(`/product/${id}`, data)
        return res.data
    } catch (error) {
        console.error("Gagal update product", error)
        throw error
    }
}

export async function deleteProduct(id: number) {
    try {
        const res = await api.delete(`/product/${id}`)
        return res.data
    } catch (error) {
        throw error
    }
}

//cartItem

type GetCartItemParams = {
    cart_id?: number
    product_id?: number
    page?: number
    row?: number
    id?: number
    status?: string
}

export async function getCartItem(params: GetCartItemParams) {
    const res = await api.get(`/cart-item`, {
        params: params || {},
    })
    return res.data
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

export async function updateCartItem(id: number, data: {
    product_id?: number
    qty?: number
    status?: string
}) {
    try {
        const res = await api.put(`/cart-item/${id}`, data)
        return res.data
    } catch (error) {
        console.error("Gagal update cart item", error)
        throw error
    }
}

export async function deleteCartItem(id: number) {
    try {
        const res = await api.delete(`/cart-item/${id}`)
        return res.data
    } catch (error) {
        console.error("Gagal delete cart item", error)
        throw error
    }
}

//category

export async function getCategory(params: {
    id?: number
    page?: number
    row?: number
}) {
    const res = await api.get("/category", {
        params: params || {}
    })
    return res.data
}

export async function addCategory(data: {
    name: string
}) {
    try {
        const res = await api.post("/category", data)
        return res.data
    } catch (error) {
        console.error("Gagal menyimpan category", error)
        throw error
    }
}

export async function updateCategory(data: {
    name: string
}, id: number) {
    try {
        const res = await api.put(`/category/${id}`, data)
        return res.data
    } catch (error) {
        console.error("Gagal update category", error)
        throw error
    }
}

export async function deleteCategory(id: number) {
    try {
        const res = await api.delete(`/category/${id}`)
        return res.data
    } catch (error) {
        console.error("Gagal delete category", error)
        throw error
    }
}