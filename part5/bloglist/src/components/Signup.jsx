import React, { useState } from "react"
import userService from "../services/user"
import { useNavigate } from "react-router-dom"
import "../App.css"

const Signup = ({ giveFeedback }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [lname, setLName] = useState("")

  const [errorMessage, setErrorMessage] = useState({
    name: false,
    username: false,
    password: false,
    cpassword: false,
    general: false,
  })
  const resetErrors = () => {
    setErrorMessage({
      message: "",
      name: false,
      username: false,
      password: false,
      cpassword: false,
      general: false,
    })
  }
  const navigate = useNavigate()

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
  // At least 6 characters, one letter, one number

  const validateForm = () => {
    resetErrors()
    if (!password || !username || !name || password !== confirmPassword) {
      if (!password || !passwordRegex.test(password)) {
        setErrorMessage((prevErrors) => ({
          ...prevErrors,
          password: true,
        }))
      }
      if (!username) {
        setErrorMessage((prevErrors) => ({
          ...prevErrors,
          username: true,
        }))
      }
      if (!name) {
        setErrorMessage((prevErrors) => ({
          ...prevErrors,
          name: true,
        }))
      }
      if (password !== confirmPassword) {
        setErrorMessage((prevErrors) => ({
          ...prevErrors,
          cpassword: true,
        }))
        return false
      }
      return false
    }

    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const newUser = {
      name: `${name} ${lname}`.trim(),
      username,
      password,
    }
    if (validateForm()) {
      try {
        await userService.createUser(newUser)
        giveFeedback(
          "Account created successfully! You can now log in",
          "success",
          9000
        )

        navigate("/login")
      } catch (exception) {
        giveFeedback("Username already exists. Please choose another", "error")
      }
    }
  }

  return (
    <div className="blog-list">
      <div id="signup" className="blog-card">
        <h2 className="blog-form-title">Create New Account</h2>
        <form id="signup" className="blog-form" onSubmit={handleSubmit}>
          <div className="name-wrapper">
            <div className="input-div">
              <label className="required">First Name</label>
              <input
                placeholder="First name"
                type="text"
                value={name}
                name="Name"
                onChange={({ target }) => {
                  setName(target.value)
                  setErrorMessage((prevErrors) => ({
                    ...prevErrors,
                    name: false,
                  }))
                }}
                className={errorMessage.name ? "input-error" : undefined}
              />
              {errorMessage.name && (
                <label className="error-label">First name is required</label>
              )}
            </div>
            <div className="input-div">
              <label>Last Name</label>
              <input
                placeholder="Last name"
                type="text"
                value={lname}
                name="Name"
                onChange={({ target }) => setLName(target.value)}
              />
            </div>
          </div>

          <div className="input-div">
            <label className="required">Username</label>
            <input
              placeholder="Enter username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => {
                setUsername(target.value)
                setErrorMessage((prevErrors) => ({
                  ...prevErrors,
                  username: false,
                }))
              }}
              className={errorMessage.username ? "input-error" : undefined}
            />
            {errorMessage.username && (
              <label className="error-label">Username is required</label>
            )}
          </div>

          <div className="input-div">
            <label className="required">Password</label>
            <input
              placeholder="Enter password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => {
                setPassword(target.value)
                setErrorMessage((prevErrors) => ({
                  ...prevErrors,
                  password: false,
                }))
              }}
              className={
                errorMessage.password || errorMessage.cpassword
                  ? "input-error"
                  : undefined
              }
            />

            {password && !passwordRegex.test(password) && (
              <label className="error-label">
                Password must be at least 6 characters long and contain at least
                one letter and one number.
              </label>
            )}
            {errorMessage.password && (
              <label className="error-label">Password required</label>
            )}
          </div>

          <div className="input-div">
            <label className="required">Confirm Password</label>
            <input
              placeholder="Confirm password"
              type="password"
              value={confirmPassword}
              name="ConfirmPassword"
              onChange={({ target }) => {
                setConfirmPassword(target.value)
                setErrorMessage((prevErrors) => ({
                  ...prevErrors,
                  cpassword: false,
                }))
              }}
              className={errorMessage.cpassword ? "input-error" : undefined}
            />
            {errorMessage.cpassword && (
              <label className="error-label">Passwords don't match</label>
            )}
          </div>

          <button id="signup" type="submit">
            Create New Account
          </button>
        </form>
      </div>
    </div>
  )
}

export default Signup
