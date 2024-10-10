const blogsInDb = async () => {
  const blog = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}
module.exports = {
  blogsInDb,
}
