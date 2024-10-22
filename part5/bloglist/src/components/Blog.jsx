import "../App.css"

import { useState, useEffect, useRef } from "react"
import { IoEllipsisVertical, IoTrash } from "react-icons/io5"
import { GoHeart, GoHeartFill, GoComment } from "react-icons/go"
import { BiSolidSend } from "react-icons/bi"
import blogService from "../services/blogs"
import Comment from "./Comment"

const Blog = (props) => {
  const { blog, userId, toggleLikes, handleDeleteBlog, giveFeedback } = props
  const [visible, setVisible] = useState(true)
  const [liked, setLiked] = useState(false)
  const [comments, setComments] = useState([])
  const [dropDownShow, setDropDownShow] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const contentRef = useRef(null)
  const commentRef = useRef(null)

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
  const handleAddComment = async (event) => {
    event.preventDefault()
    if (!newComment) {
      return
    }

    try {
      await blogService.addComment(blog.id, { content: newComment })
      setNewComment("")
      giveFeedback("Comment added successfully", "success")
    } catch (error) {
      giveFeedback("Cannot add comment", "error")
      console.log(error.message)
    }
    fetchComments()
  }
  const handleDeleteComment = async (commentId) => {
    try {
      await blogService.deleteComment(blog.id, commentId)
      fetchComments()
      giveFeedback("Comment deleted successfully", "success")
    } catch (error) {
      console.log(error)
      giveFeedback(error.message, "error")
    }
  }
  const fetchComments = async () => {
    const allComments = await blogService.getComments(blog.id)
    setComments(allComments)
  }

  useEffect(() => {
    setLiked(blog.likes.includes(userId))
  }, [blog.likes, userId])

  useEffect(() => {
    fetchComments()
  }, [])
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
        className="hide-overflow"
      >
        <div className="hr" />
        <div
          className="blog-text"
          dangerouslySetInnerHTML={{ __html: formatText(blog.url) }}
        />
      </div>

      <div className="hr" />
      <div className="blog-footer">
        <div className="blog-interactions">
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
          <span
            className="hover"
            onClick={() => {
              setShowComments(!showComments)
            }}
          >
            <GoComment />
            {blog.comments.length}
          </span>
          <span>
            {`${blog.likes.length} ${
              blog.likes.length === 1 ? "like" : "likes"
            }`}
          </span>
        </div>

        <div
          className="blog-comments hide-overflow"
          ref={commentRef}
          style={{
            maxHeight:
              showComments && commentRef.current
                ? `${commentRef.current.scrollHeight}px`
                : "0",
          }}
        >
          <div className="hr" />
          <form className="comment-input" onSubmit={handleAddComment}>
            <input
              value={newComment}
              placeholder="Add new comment"
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="empty-btn" type="submit">
              <BiSolidSend className="comment-icon" />
            </button>
          </form>

          {comments.map((comment) => (
            <Comment
              comment={comment}
              handleDeleteComment={handleDeleteComment}
              userId={userId}
              key={comment.id}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Blog
