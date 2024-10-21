import React, { useState, useEffect } from "react"
import Blog from "./Blog"
import BlogForm from "./BlogForm"
import { FaChevronDown } from "react-icons/fa"
import blogService from "../services/blogs"

const Home = ({ user, giveFeedback }) => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: "", url: "" })
  const [dropDownShow, setDropDownShow] = useState(false)
  const [sortCriteria, setSortCriteria] = useState("Latest")
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
  const sortedBlogs = () => {
    let sorted = [...blogs]
    if (sortCriteria === "Most Likes") {
      sorted.sort((a, b) => b.likes.length - a.likes.length)
    } else if (sortCriteria == "Latest") {
      sorted.reverse()
    }
    return sorted
  }
  const fetchBlogs = async () => {
    const allBlogs = await blogService.getAll()
    setBlogs(allBlogs)
    console.log(allBlogs)
  }
  const options = ["Latest", "Most Likes", "Oldest"]

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
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => {
            setDropDownShow(true)
          }}
          onMouseLeave={() => {
            setDropDownShow(false)
          }}
          onClick={() => {
            setDropDownShow(!dropDownShow)
          }}
        >
          <div className="dropdown-menu-selector hover">
            {sortCriteria}
            <FaChevronDown style={{ marginTop: "2.99px" }} />
          </div>

          <div
            className="dropdown-menu"
            id="sort"
            style={{ maxHeight: dropDownShow ? "100px" : "0" }}
          >
            {options
              .filter((option) => option !== sortCriteria)
              .map((option) => (
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSortCriteria(option)
                    setDropDownShow(false)
                  }}
                >
                  <p>{option}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
      {sortedBlogs()
        .slice()

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
