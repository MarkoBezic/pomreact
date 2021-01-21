import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { AuthConsumer } from './AuthContext'

class NavBar extends Component {
  state = {}
  render() {
    return (
      <AuthConsumer>
        {({ user, logOut }) => (
          <>
            <nav className="navbar navbar-expand-md navbar-light bg-dark">
              <span className="navbar-brand text-white">TaskTimer</span>
              <div>
                {user.id ? (
                  <>
                    <small className="text-white m-1">
                      {' '}
                      user: {user.email}
                    </small>
                    <button button onClick={e => logOut(e)}>
                      Log out
                    </button>
                  </>
                ) : (
                  <small className="text-white ml-2">Please sign in</small>
                )}
              </div>
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                  <Link
                    to={`/${user.id}/timer`}
                    className="nav-link text-white"
                  >
                    Home <span className="sr-only">(current)</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </>
        )}
      </AuthConsumer>
    )
  }
}

export default NavBar
