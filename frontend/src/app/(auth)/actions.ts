import api from '@/lib/axios'

export async function login(data: {
  nik: string,
  password: string
}) {
  try {
    const res = await api.post('/auth/login', data)
    localStorage.setItem('token', res.data.Token);
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
    localStorage.removeItem('token')
    window.location.href = "/login";
  } catch (error) {
    console.log(error);
    throw error
  }
}

export async function infoLogin() {
  try {
    const res = await api.get("/auth/infologin")
    console.log(res);
    return res.data
  } catch (error) {
    console.log(error);
    throw error
  }
}