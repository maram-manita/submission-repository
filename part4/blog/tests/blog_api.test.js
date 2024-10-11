const { test, after, beforeEach } = require("node:test")
const Blog = require("../models/blog")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const assert = require("assert")
const helper = require("../utils/blog_helper")

const api = supertest(app)

const initialBlogs = [
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
]
beforeEach(async () => {
  await Blog.deleteMany({})
  let BlogObject = new Blog(initialBlogs[0])
  await BlogObject.save()
  BlogObject = new Blog(initialBlogs[1])
  await BlogObject.save()
})

test("accurate number of blog posts", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)

  assert.strictEqual(
    response.body.length,
    initialBlogs.length,
    "Number of blog posts does not match"
  )
})

test("id exists", async () => {
  const response = await api.get("/api/blogs")
  response.body.forEach((blog) => {
    assert(blog.id, "Blog id should be defined")
    assert.strictEqual(blog._id, undefined, "Blog _id should be undefined")
  })
})
test("successfully posted new blog", async () => {
  const newBlog = {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  }

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/)

  const response = await api.get("/api/blogs")

  assert.strictEqual(response.body.length, initialBlogs.length + 1)
})

test("likes default to zero", async () => {
  const newBlog = {
    title: "test title",
    author: "test author",
    url: "test url",
  }
  const response = await api.post("/api/blogs").send(newBlog)
  assert.strictEqual(response.body.likes, 0)
})

test("missing title or url not accepted", async () => {
  const newBlog = {
    author: "test author",
  }
  await api.post("/api/blogs").send(newBlog).expect(400)
})

test("deletion of a note", async () => {
  const initialResponse = await api.get("/api/blogs")
  const blogtoDel = initialResponse.body[0]
  await api.delete(`/api/blogs/${blogtoDel.id}`).expect(204)
  const response = await api.get("/api/blogs")
  assert.strictEqual(response.body.length, initialResponse.body.length - 1)
})
test("updating note (likes)", async () => {
  const initialResponse = await api.get("/api/blogs")
  const blogtoUpd = initialResponse.body[0]
  const newLikes = blogtoUpd.likes + 1
  const response = await api
    .put(`/api/blogs/${blogtoUpd.id}`)
    .send({ likes: newLikes })
    .expect(200)
  assert.strictEqual(response.body.likes, newLikes)
})
after(async () => {
  await mongoose.connection.close()
})
