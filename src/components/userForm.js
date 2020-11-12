import React, { Component } from 'react'
import { AuthConsumer } from './AuthContext'

class UserForm extends Component {
  emailInput = React.createRef()
  passwordInput = React.createRef()

  render() {
    return (
      <AuthConsumer>
        {({ signUp, logIn, user }) => (
          <>
            <div className="sign-up-wrapper d-flex flex-column align-items-center p-3">
              <h2>Sign in or create account</h2>
              <form className="sign-up-form">
                <div>
                  <input
                    className="m-1"
                    ref={this.emailInput}
                    type="email"
                    name="email"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <input
                    className="m-1"
                    ref={this.passwordInput}
                    type="password"
                    name="password"
                    placeholder="Password"
                  />
                </div>
                <div>
                  <button
                    className="m-1"
                    onClick={e =>
                      logIn(
                        this.emailInput.current.value,
                        this.passwordInput.current.value,
                        e
                      )
                    }
                  >
                    Log In
                  </button>
                  <button
                    className="m-1"
                    onClick={e =>
                      signUp(
                        this.emailInput.current.value,
                        this.passwordInput.current.value,
                        e
                      )
                    }
                  >
                    {' '}
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </AuthConsumer>
    )
  }
}

export default UserForm
