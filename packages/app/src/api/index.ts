import axiosStatic from 'axios'

const axios = axiosStatic.create({
  baseURL: 'https://jsonplaceholder.typicode.com/'
})

export async function getUsers(filterParams?: any) {
  const res = await axios.get('/users', { params: filterParams })
  return res.data
}

export async function getUser(id: any) {
  const res = await axios.get('/users/' + id)
  return res.data
}

export async function updateUser(id: any, data: any) {
  const res = await axios.put('/users/' + id, data)
  return res.data
}

export async function createUser(data: any) {
  const res = await axios.post('/users', data)
  return res.data
}

export async function removeUser(id: any) {
  const res = await axios.delete('/users/' + id)
  return res.data
}
