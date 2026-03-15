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
  image: File
}) {
  try {
    const res = await api.post("/product", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
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
  image?: File | null
}, id: number) {
  try {
    const res = await api.put(`/product/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
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

//pesanan
type GetPesananParams = {
  page?: number
  row?: number
  id?: number
  status?: string
  no_table?: number
}

export async function getPesanan(params: GetPesananParams) {
  const res = await api.get(`/pesanan`, {
    params: params || {},
  })
  return res.data
}

export async function getPesananDetail(id: number) {
  const res = await api.get(`/pesanan/${id}`)
  return res.data
}

export async function getTransactionCart(params: GetCartParams) {
  const res = await api.get(`/transaction/kasir`, {
    params: params || {},
  })
  return res.data
}

//transaction
export async function addTransaction(data: {
  cart_id?: number
  total?: number
  payment_method?: string
  tax?: number
  change_returned?: number
}) {
  try {
    const res = await api.post("/transaction", data)
    return res.data
  } catch (error) {
    console.error("Gagal tambah transaction", error)
    throw error
  }
}

//permission
export async function getPermission(params: {
  id?: number
  page?: number
  row?: number
}) {
  const res = await api.get("/permission", {
    params: params || {}
  })
  return res.data
}

export async function addPermission(data: {
  name: string,
  description: string
}) {
  try {
    const res = await api.post("/permission", data)
    return res.data
  } catch (error) {
    console.error("Gagal menyimpan permission", error)
    throw error
  }
}

export async function updatePermission(data: {
  name: string,
  description: string
}, id: number) {
  try {
    const res = await api.put(`/permission/${id}`, data)
    return res.data
  } catch (error) {
    console.error("Gagal update permission", error)
    throw error
  }
}

export async function deletePermission(id: number) {
  try {
    const res = await api.delete(`/permission/${id}`)
    return res.data
  } catch (error) {
    console.error("Gagal delete permission", error)
    throw error
  }
}

//role
export async function getRole(params: {
  id?: number
  page?: number
  row?: number
}) {
  const res = await api.get("/role", {
    params: params || {}
  })
  return res.data
}

export async function addRole(data: {
  role: string,
  permission: string
}) {
  try {
    const res = await api.post("/role", data)
    return res.data
  } catch (error) {
    console.error("Gagal menyimpan role", error)
    throw error
  }
}

export async function updateRole(data: {
  role: string,
  permission: string
}, id: number) {
  try {
    const res = await api.put(`/role/${id}`, data)
    return res.data
  } catch (error) {
    console.error("Gagal update role", error)
    throw error
  }
}

export async function deleteRole(id: number) {
  try {
    const res = await api.delete(`/role/${id}`)
    return res.data
  } catch (error) {
    console.error("Gagal delete role", error)
    throw error
  }
}
