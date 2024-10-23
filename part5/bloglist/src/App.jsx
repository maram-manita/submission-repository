import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import blogService from "./services/blogs"

import Login from "./components/Login"
import "./App.css"

import Home from "./components/Home"
import Signup from "./components/Signup"
import Navbar from "./components/Navbar"

const Notification = ({ feedback }) => {
  return (
    feedback.show && (
      <div
        className={`toast ${feedback.feedbackType} ${!feedback.show && "hide"}
      }`}
      >
        {feedback.message}
      </div>
    )
  )
}

const App = () => {
  const [user, setUser] = useState(null)
  const [feedback, setFeedback] = useState({
    message: "",
    feedbackType: "success",
    show: false,
  })

  const giveFeedback = (message, feedbackType, duration = 1000) => {
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
        <Navbar user={user} handleLogout={handleLogout} />
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
