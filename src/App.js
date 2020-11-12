import React from 'react'
import Timer from './components/Timer'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import EditMasterTask from './components/EditMasterTask'
import EditTaskRecord from './components/EditTaskRecord'
import PageNotFound from './components/PageNotFound'
import NavBar from './components/NavBar'
import UserForm from './components/userForm'
import { AuthProvider } from './components/AuthContext'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <Switch>
          <Route exact path="/" component={UserForm} />
          <Route
            exact
            path="/timer"
            render={props => (
              <div className="app bg-success pb-5">
                <Timer {...props} />
              </div>
            )}
          />
          <Route
            exact
            path="/edit-mastertask"
            render={props => <EditMasterTask {...props} />}
          />
          <Route
            exact
            path="/edit-rounds"
            render={props => <EditTaskRecord {...props} />}
          />
          <Route component={PageNotFound} />
        </Switch>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
