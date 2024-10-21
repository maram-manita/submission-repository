import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"

import blogService from "./services/blogs"

import Login from "./components/Login"
import "./App.css"

import { IoMdExit } from "react-icons/io"
import Home from "./components/Home"
import Signup from "./components/Signup"

const Notification = ({ feedback }) => {
  return (
    <div
      className={`toast ${feedback.feedbackType} ${
        feedback.show ? "show" : "hide"
      }`}
    >
      {feedback.message}
    </div>
  )
}

const App = () => {
  const [user, setUser] = useState(null)
  const [feedback, setFeedback] = useState({
    message: "",
    feedbackType: "success",
    show: false,
  })

  const giveFeedback = (message, feedbackType, duration = 3000) => {
    setFeedback({
      message,
      feedbackType,
      show: true,
    })
    setTimeout(() => {
      setFeedback((prevFeedback) => ({
        ...prevFeedback,
        show: false,
      }))
    }, duration)
  }

  const handleLogout = () => {
    blogService.clearToken()
    setUser(null)
    window.localStorage.removeItem("loggedInUser")
    giveFeedback("Successfully logged out", "success")
  }
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedInUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  return (
    <Router>
      <div className="App">
        <Notification feedback={feedback} />
        <nav className="navbar">
          <Link style={{ textDecoration: "none", color: "black" }} to="/">
            <h1 style={{ fontSize: "38px" }} className="hover">
              BlogList
            </h1>
          </Link>
          {user ? (
            <div className="navbar-items">
              <p className="user-name">{user.name}</p>
              <div className="vr"></div>
              <IoMdExit
                style={{ fontSize: "1.4rem" }}
                className="hover"
                onClick={handleLogout}
              />
            </div>
          ) : (
            <div className="navbar-items">
              <Link to="/login">
                <button className="btn-secondary">Login</button>
              </Link>
              <Link to="/signup">
                <button>Sign Up</button>
              </Link>
            </div>
          )}
        </nav>
        <Routes>
          <Route
            path="/"
            element={<Home user={user} giveFeedback={giveFeedback} />}
          />
          <Route
            path="/login"
            element={<Login setUser={setUser} giveFeedback={giveFeedback} />}
          />
          <Route
            path="/signup"
            element={<Signup giveFeedback={giveFeedback} />}
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
