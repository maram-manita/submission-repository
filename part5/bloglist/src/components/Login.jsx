import React, { useState } from "react"
import PropTypes from "prop-types"
import { useNavigate, Link } from "react-router-dom"
import "../App.css"
import loginService from "../services/login"
import blogService from "../services/blogs"

const Login = ({ setUser, giveFeedback }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      blogService.setToken(user.token)
      setUser(user)
      window.localStorage.setItem("loggedInUser", JSON.stringify(user))
      setUsername("")
      setPassword("")
      giveFeedback("successfully logged in", "success")
      navigate("/")
    } catch (exception) {
      giveFeedback("Wrong username or password", "error")
    }
  }

  return (
    <div className="blog-list">
      <div id="login-info" className="toast info">
        You can log in with username visitor, password password1
      </div>
      <div id="login" className="blog-card">
        <h2 id="login" className="blog-form-title">
          Welcome Back
        </h2>
        <form id="login" className="blog-form" onSubmit={handleLogin}>
          <div className="input-div">
            <label>Username</label>
            <input
              placeholder="Enter username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div className="input-div">
            <label>Password</label>

            <input
              placeholder="Enter password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id="login" type="submit">
            Login
          </button>
        </form>
        <p>
          Don't have an account?
          <Link
            to="/signup"
            style={{
              color: "#0346f2",
              textDecoration: "none",
              marginLeft: "2px",
            }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
Login.PropTypes = {
  setUser: PropTypes.func.isRequired,
  giveFeedback: PropTypes.func.isRequired,
}
export default Login
