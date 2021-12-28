import axiosStatic from 'axios'

const axios = axiosStatic.create({
  baseURL: 'https://jsonplaceholder.typicode.com/'
})

export async function getUsers() {
  const res = await axios.get('/users')
  return res.data
}
