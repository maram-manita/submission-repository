import "../App.css"

import { useState, useEffect, useRef } from "react"
import {
  IoEllipsisVertical,
  IoTrash,
  IoHeartOutline,
  IoHeartSharp,
} from "react-icons/io5"

const Blog = ({
  blog,
  userId,
  toggleLikes,
  handleDeleteBlog,
  giveFeedback,
}) => {
  const [visible, setVisible] = useState(false)
  const [liked, setLiked] = useState(false)
  const [dropDownShow, setDropDownShow] = useState(false)
  const contentRef = useRef(null)

  const handleToggleLikes = () => {
    if (userId) {
      toggleLikes(blog)
      setLiked(!liked)
    } else {
      giveFeedback("Log in to like post", "info")
    }
  }
  useEffect(() => {
    setLiked(blog.likes.includes(userId))
  }, [blog.likes, userId])
  return (
    <div className="blog-card">
      <div
        className="blog-title"
        onClick={() => {
          setVisible(!visible)
        }}
        style={{ cursor: "pointer" }}
      >
        {blog.title}
      </div>
      <div className="blog-subheading">
        <div className="blog-handle">
          <p className="author">{blog.author}</p>
          <p className="handle">@{blog.user.username}</p>
        </div>
        <div style={{ position: "relative" }}>
          <IoEllipsisVertical
            style={{
              visibility:
                userId === blog.user.id || userId === "670a60f033bd04db30f7d55e"
                  ? "visible"
                  : "hidden",
            }}
            className="hover"
            onClick={() => {
              setDropDownShow(!dropDownShow)
            }}
          />
          <div
            className="dropdown-menu"
            style={{ maxHeight: dropDownShow ? "50px" : "0" }}
          >
            <div
              onClick={() => {
                handleDeleteBlog(blog.id)
              }}
              className="hover"
            >
              <IoTrash /> Delete
            </div>
          </div>
        </div>
      </div>

      <div
        ref={contentRef}
        style={{
          maxHeight: visible ? `${contentRef.current.scrollHeight}px` : "0",
        }}
        className="blog-content"
      >
        <div className="hr" />
        <p>{blog.url}</p>
      </div>

      <div className="hr" />
      <div className="blog-footer">
        {liked ? (
          <span>
            <IoHeartSharp className="hover" onClick={handleToggleLikes} />
            Liked
          </span>
        ) : (
          <span>
            <IoHeartOutline className="hover" onClick={handleToggleLikes} />
            Like
          </span>
        )}
        <span>
          {blog.likes.length} {blog.likes.length === 1 ? "like" : "likes"}
        </span>
      </div>
    </div>
  )
}

export default Blog
