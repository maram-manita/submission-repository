import React, { useState, useEffect } from "react"
import Blog from "./Blog"
import BlogForm from "./BlogForm"
import { FaChevronDown } from "react-icons/fa"
import blogService from "../services/blogs"

const Home = ({ user, giveFeedback }) => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: "", url: "" })
  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try {
      await blogService.createBlog(newBlog)
      setNewBlog({ url: "", title: "" })
      giveFeedback("Blog added successfully", "success")
    } catch (e) {
      giveFeedback("error creating blog", "error")
    }
    fetchBlogs()
  }
  const handleDeleteBlog = async (blogId) => {
    try {
      await blogService.deleteBlog(blogId)

      giveFeedback("Blog deleted successfully", "success")
    } catch (e) {
      giveFeedback("error deleting blog", "error")
    }
    fetchBlogs()
  }
  const toggleLikes = async (blog) => {
    try {
      const updatedBlog = await blogService.toggleLike(blog.id)

      setBlogs((prevBlogs) =>
        prevBlogs.map((b) =>
          b.id === updatedBlog.id ? { ...b, likes: updatedBlog.likes } : b
        )
      )
      console.log(updatedBlog)
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }
  const fetchBlogs = async () => {
    const allBlogs = await blogService.getAll()
    setBlogs(allBlogs)
    console.log(allBlogs)
  }

  useEffect(() => {
    fetchBlogs()
  }, [])
  return (
    <div className="blog-list">
      {user && (
        <BlogForm
          username={user.username}
          name={user.name}
          newBlog={newBlog}
          setNewBlog={setNewBlog}
          handleCreateBlog={handleCreateBlog}
        />
      )}
      <div className="title-section">
        <h2>All Blogposts</h2>
        <div>
          Sort
          <FaChevronDown className="hover" />
        </div>
      </div>
      {blogs
        .slice()
        .reverse()
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            userId={user ? user.id : null}
            toggleLikes={toggleLikes}
            handleDeleteBlog={handleDeleteBlog}
            giveFeedback={giveFeedback}
          />
        ))}
    </div>
  )
}

export default Home
