import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { AuthConsumer } from './AuthContext'

class NavBar extends Component {
  state = {}
  render() {
    return (
      <AuthConsumer>
        {({ user, logOut }) => (
          <nav className="navbar navbar-expand-md navbar-light bg-dark">
            <span className="navbar-brand text-white">TaskTimer</span>
            <div>
              <small className="text-white m-1"> user: {user.email}</small>
              <button onClick={e => logOut(e)}>Log out</button>
              <small className="text-white ml-2">Please sign in</small>
            </div>
            {/* 
            <button
              className="navbar-toggler bg-light"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button> */}
            {/* <div className="collapse navbar-collapse" id="navbarText"> */}
            <ul className="navbar-nav ml-auto">
              <li className="nav-item active">
                <Link to="/timer" className="nav-link text-white">
                  Home <span className="sr-only">(current)</span>
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white">Charts</a>
              </li>
            </ul>
            {/* </div> */}
          </nav>
        )}
      </AuthConsumer>
    )
  }
}

export default NavBar
