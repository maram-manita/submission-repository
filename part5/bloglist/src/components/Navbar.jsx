import React, { useState } from "react"
import { Link } from "react-router-dom"
import { IoMdExit } from "react-icons/io"
import { LuMenu } from "react-icons/lu"

const Navbar = ({ user, handleLogout }) => {
  const [showDropDown, setShowDropDown] = useState(false)
  return (
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
        <>
          <div className="navbar-items right">
            <Link to="/login">
              <button className="btn-secondary">Login</button>
            </Link>
            <Link to="/signup">
              <button>Sign Up</button>
            </Link>
          </div>
          <div className="navbar-items-mobile" style={{ position: "relative" }}>
            <LuMenu
              onClick={() => {
                setShowDropDown(!showDropDown)
              }}
            />
            <div
              className="dropdown-menu"
              id="sort"
              style={{ maxHeight: showDropDown ? "200px" : "0" }}
            >
              <div className="dropdown-item">
                <Link
                  style={{ color: "black", textDecoration: "none" }}
                  to="/login"
                >
                  Login
                </Link>
              </div>
              <div className="dropdown-item">
                <Link
                  style={{ color: "black", textDecoration: "none" }}
                  to="/signup"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}

export default Navbar
