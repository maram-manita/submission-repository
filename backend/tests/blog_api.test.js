const { test, after, beforeEach, describe } = require("node:test")
const Blog = require("../models/blog")
const User = require("../models/user")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const assert = require("assert")
const bcrypt = require("bcrypt")

const api = supertest(app)
const initialBlogs = [
  {
    title: "test blog 1",
    author: "admin",
    url: "www.testurl1.com",
    likes: 12,
  },
  {
    title: "test blog 2",
    author: "admin",
    url: "www.testurl2.com",
    likes: 10,
  },
]
beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  const passwordHash = await bcrypt.hash("admin", 10)
  const user = new User({
    username: "admin",
    passwordHash,
  })

  await user.save()
  const loginResponse = await api
    .post("/api/login")
    .send({ username: "admin", password: "admin" })

  token = loginResponse.body.token
  console.log(loginResponse.body)

  const blogPromises = initialBlogs.map((blog) =>
    api.post("/api/blogs").set("Authorization", `Bearer ${token}`).send(blog)
  )

  await Promise.all(blogPromises)
})
describe("Blog validation operations", () => {
  test("Fetched all blog posts", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)

    assert.strictEqual(response.body.length, initialBlogs.length)
  })
  test("Create new blog with valid auth", async () => {
    const newBlog = {
      title: "test",
      url: "test",
    }
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const response = await api.get("/api/blogs")

    assert.strictEqual(response.body.length, initialBlogs.length + 1)
  })
  test("Create blog object with ID", async () => {
    const response = await api.get("/api/blogs")
    response.body.forEach((blog) => {
      assert(blog.id, "Blog id should be defined")
    })
  })
  test("Cannot create blog oject without title or URL", async () => {
    const newBlog = {
      author: "test author",
    }
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })
  test("Likes default to zero", async () => {
    const newBlog = {
      title: "test title",
      url: "test url",
    }
    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
    assert.strictEqual(response.body.likes, 0)
  })
  test("deletion of blog object", async () => {
    const initialResponse = await api.get("/api/blogs")
    const blogtoDel = initialResponse.body[0]
    await api
      .delete(`/api/blogs/${blogtoDel.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204)
    const response = await api.get("/api/blogs")
    assert.strictEqual(response.body.length, initialResponse.body.length - 1)
  })
  test("updating note (likes)", async () => {
    const initialResponse = await api.get("/api/blogs")
    const blogtoUpd = initialResponse.body[0]
    const newLikes = blogtoUpd.likes + 1
    const response = await api
      .put(`/api/blogs/${blogtoUpd.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ likes: newLikes })
      .expect(201)
    assert.strictEqual(response.body.likes, newLikes)
  })
})

describe("User creation tests", () => {
  test("Doesn't allow passwords under three characters", async () => {
    const newUser = {
      name: "test",
      password: "12",
    }
    await api.post("/api/users").send(newUser).expect(400)
  })
})

describe("Testing authorization", () => {
  test("Cannot add blog without auth", async () => {
    const newBlog = {
      title: "test",
      url: "test",
    }
    await api.post("/api/blogs").send(newBlog).expect(401)
  })
})
after(async () => {
  await mongoose.connection.close()
})
