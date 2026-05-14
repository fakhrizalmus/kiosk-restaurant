import api from '@/lib/axios'

export async function login(data: {
  nik: string,
  password: string
}) {
  try {
    const res = await api.post('/auth/login', data)
    window.location.href = "/transaction";
    return res.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export async function register(data: {
  name: string,
  nik: string,
  password: string
}) {
  try {
    const res = await api.post('/auth/register', data)
    window.location.href = "/login";
    return res.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export async function logout() {
  try {
    await api.post('/auth/logout')
    window.location.href = "/login";
  } catch (error) {
    console.log(error);
    throw error
  }
}

export async function infoLogin() {
  try {
    const res = await api.get("/auth/me")
    console.log(res);
    return res.data
  } catch (error) {
    console.log(error);
    throw error
  }
}