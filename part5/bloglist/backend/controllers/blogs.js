const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const jwt = require("jsonwebtoken")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    name: 1,
    id: 1,
    username: 1,
  })
  response.json(blogs)
})

blogsRouter.get("/:id", async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" })
  }
  const user = request.user

  if (!body.title || !body.url) {
    return response.status(400).end()
  }
  const blog = new Blog({
    title: body.title,
    author: user.name,
    url: body.url,
    likes: [],
    user: user.id,
    comments: [],
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete("/:id", async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" })
  }
  const user = request.user
  if (
    user.id.toString() !== decodedToken.id.toString() &&
    user.username !== "admin"
  ) {
    return response.status(403).json({ error: "permission denied" })
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" })
  }
  const user = request.user
  if (user.id.toString() !== decodedToken.id.toString()) {
    return response.status(403).json({ error: "permission denied" })
  }
  const blog = {
    title: body.title,
    url: body.url,
    likes: body.likes,
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })
  response.status(201).json(updatedBlog)
})
blogsRouter.put("/:id/togglelike", async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(400).json({ error: "Must log in to like post" })
  }
  const blog = await Blog.findById(req.params.id)

  if (!blog.likes.includes(user.id)) {
    blog.likes.push(user.id)
    await blog.save()
    return res.status(200).json(blog)
  } else {
    blog.likes = blog.likes.filter((id) => id.toString() !== user.id.toString())
    await blog.save()
    return res.status(200).json(blog)
  }
})
blogsRouter.post("/:id/comments", async (request, response) => {
  const user = request.user
  if (!user) {
    return res.status(400).json({ error: "Must log in to  comment" })
  }
  const content = request.body.content

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: "Blog post not found" })
  }

  blog.comments.push({ userId: user.id, content })
  await blog.save()

  response.status(201).json(blog)
})
blogsRouter.get("/:id/comments", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate(
    "comments.userId",
    {
      username: 1,
      name: 1,
    }
  )
  if (!blog) {
    return response.status(404).json({ error: "Blog post not found" })
  }

  response.json(blog.comments)
})
blogsRouter.delete(
  "/:id/comments/:commentId",
  async (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" })
    }
    const user = request.user
    if (
      user.id.toString() !== decodedToken.id.toString() &&
      user.username !== "admin"
    ) {
      return response.status(403).json({ error: "permission denied" })
    }
    const blog = await Blog.findById(request.params.id)

    const commentIndex = blog.comments.findIndex(
      (comment) => comment.id === request.params.commentId
    )
    if (commentIndex === -1) {
      return response.status(404).json({ error: "Comment not found" })
    }
    blog.comments.splice(commentIndex, 1)
    await blog.save()
    response.status(204).end()
  }
)
module.exports = blogsRouter
