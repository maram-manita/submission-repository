import "../App.css"

import { useState, useEffect, useRef } from "react"
import { IoEllipsisVertical, IoTrash } from "react-icons/io5"
import { GoHeart, GoHeartFill } from "react-icons/go"

const Blog = (props) => {
  const { blog, userId, toggleLikes, handleDeleteBlog, giveFeedback } = props
  const [visible, setVisible] = useState(true)
  const [liked, setLiked] = useState(false)
  const [dropDownShow, setDropDownShow] = useState(false)
  const contentRef = useRef(null)

  const formatText = (text) => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
    const formattedLines = lines.map((line, index) => {
      line = line.replace(/<b>(.*?)<\/b>/g, "<strong>$1</strong>")

      line = line.replace(/<i>(.*?)<\/i>/g, "<em>$1</em>")

      const listMatch = line.match(/^(\d+)\.\s+(.*)$/)
      if (listMatch) {
        return `<li>${listMatch[2]}</li>`
      }
      return `<p>${line}</p>`
    })

    return formattedLines.join("")
  }
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
            onMouseLeave={() => {
              setDropDownShow(false)
            }}
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
          maxHeight:
            visible && contentRef.current
              ? `${contentRef.current.scrollHeight}px`
              : "0",
        }}
        className="blog-content"
      >
        <div className="hr" />
        <div
          className="blog-text"
          dangerouslySetInnerHTML={{ __html: formatText(blog.url) }}
        />
      </div>

      <div className="hr" />
      <div className="blog-footer">
        {liked ? (
          <span>
            <GoHeartFill
              style={{ color: "#f43662" }}
              className="hover"
              onClick={handleToggleLikes}
            />

            <p style={{ fontWeight: "500", color: "#f43662" }}>Liked</p>
          </span>
        ) : (
          <span>
            <GoHeart className="hover" onClick={handleToggleLikes} />
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
