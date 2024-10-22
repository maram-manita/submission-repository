import React, { useState } from "react"
import { IoEllipsisVertical, IoTrash } from "react-icons/io5"

const Comment = ({ comment, userId, handleDeleteComment }) => {
  const [dropDownShow, setDropDownShow] = useState(false)
  return (
    <div className="comment" key={comment.id}>
      <div className="blog-subheading">
        <div className="blog-handle">
          <p className="author">{comment.userId.name}</p>
          <p className="handle">@{comment.userId.username}</p>
        </div>
        <div style={{ position: "relative" }}>
          <IoEllipsisVertical
            style={{
              visibility:
                userId === comment.userId.id ||
                userId === "670a60f033bd04db30f7d55e"
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
                handleDeleteComment(comment.id)
              }}
              className="hover"
            >
              <IoTrash /> Delete
            </div>
          </div>
        </div>
      </div>
      <p>{comment.content}</p>
    </div>
  )
}

export default Comment
