import React, { useState } from "react"
import "../App.css"

const Collapsible = ({ title, children }) => {
  const [isActive, setIsActive] = useState(false)

  const toggleContent = () => {
    setIsActive(!isActive)
  }

  return (
    <div>
      <button
        className={`collapsible ${isActive ? "active" : ""}`}
        onClick={toggleContent}
      >
        {title}
      </button>
      <div className={`content ${isActive ? "expanded" : ""}`}>{children}</div>
    </div>
  )
}

export default Collapsible
