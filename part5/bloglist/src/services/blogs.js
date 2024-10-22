import axios from "axios"
const baseUrl = "/api/blogs"

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}
const createBlog = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}
const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}
const clearToken = () => {
  delete axios.defaults.headers.common["Authorization"]
}
const toggleLike = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.put(`${baseUrl}/${id}/togglelike`, {}, config)
  return response.data
}
const addComment = async (blogId, comment) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(
    `${baseUrl}/${blogId}/comments`,
    comment,
    config
  )
  return response.data
}

const getComments = async (blogId) => {
  const response = await axios.get(`${baseUrl}/${blogId}/comments`)
  return response.data
}
const deleteComment = async (blogId, commentId) => {
  const config = {
    headers: { Authorization: token },
  }
  await axios.delete(`${baseUrl}/${blogId}/comments/${commentId}`, config)
}
export default {
  getAll,
  setToken,
  createBlog,
  deleteBlog,
  clearToken,
  toggleLike,
  addComment,
  getComments,
  deleteComment,
}
