var _ = require("lodash")

const dummy = (blogs) => {
  return 1
}
const totalLikes = (blogs) => {
  return blogs.reduce((likes, blog) => {
    return likes + blog.likes
  }, 0)
}
const favouriteBlog = (blogs) => {
  const favouredBlog = blogs.reduce((max, blog) => {
    return max.likes > blog.likes ? max : blog
  })
  return {
    title: favouredBlog.title,
    author: favouredBlog.author,
    likes: favouredBlog.likes,
  }
}
const mostBlogs = (blogs) => {
  arr = []
  blogs.forEach((blog) => {
    entry = arr.find((entry) => entry.author === blog.author)
    if (entry) {
      entry.blogs += 1
    } else {
      arr.push({ author: blog.author, blogs: 1 })
    }
  })
  return _.maxBy(arr, "author")
}
const mostLikes = (blogs) => {
  arr = []
  blogs.forEach((blog) => {
    entry = arr.find((entry) => entry.author === blog.author)
    if (entry) {
      entry.likes += blog.likes
    } else {
      arr.push({ author: blog.author, likes: blog.likes })
    }
  })
  return _.maxBy(arr, "likes")
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
}
