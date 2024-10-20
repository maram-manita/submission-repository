import React, { useState } from "react"
import { FaPlus } from "react-icons/fa"

const BlogForm = (props) => {
  const [collapsed, setCollapsed] = useState(true)
  return (
    <div className="blog-card">
      <div
        className="blog-form-title hover"
        onClick={() => setCollapsed(!collapsed)}
      >
        <h2>Create new Post</h2>
        <FaPlus
          className="hover"
          style={{
            transform: collapsed ? "rotate(0)" : "rotate(45deg)",
            fontSize: "1.2rem",
          }}
        />
      </div>
      <div
        className="blog-content"
        style={{
          maxHeight: collapsed ? "0" : "300px",
        }}
      >
        <div className="blog-handle">
          <p className="author">{props.name}</p>
          <p className="handle">@{props.username}</p>
        </div>
        <form className="blog-form" onSubmit={props.handleCreateBlog}>
          <input
            type="text"
            placeholder="Title..."
            value={props.newBlog.title}
            name="title"
            onChange={({ target }) =>
              props.setNewBlog((prevBlog) => ({
                ...prevBlog,
                title: target.value,
              }))
            }
          />

          <textarea
            value={props.newBlog.url}
            name="content"
            placeholder="Content..."
            rows="4"
            onChange={({ target }) =>
              props.setNewBlog((prevBlog) => ({
                ...prevBlog,
                url: target.value,
              }))
            }
          />

          <div className="form-footer">
            <button type="submit">Post</button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setCollapsed(true)
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BlogForm
