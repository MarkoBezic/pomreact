import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class NavBar extends Component {
  state = {}
  render() {
    return (
      <>
        <nav className="navbar navbar-expand-md navbar-light bg-dark">
          <span className="navbar-brand text-white">Task Tracker</span>

          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <Link to={`/timer`} className="nav-link text-white">
                Home <span className="sr-only">(current)</span>
              </Link>
            </li>
          </ul>
        </nav>
      </>
    )
  }
}

export default NavBar
