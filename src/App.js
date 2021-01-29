import React from 'react'
import Timer from './components/Timer'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import EditMasterTask from './components/EditMasterTask'
import EditTaskRecord from './components/EditTaskRecord'
import PageNotFound from './components/PageNotFound'
import NavBar from './components/NavBar'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route
          exact
          path="/"
          render={props => (
            <div className="app pb-5">
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
    </BrowserRouter>
  )
}

export default App
