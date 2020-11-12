import React from 'react'
import Timer from './components/Timer'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, BrowserRouter } from 'react-router-dom'
import EditMasterTask from './components/EditMasterTask'
import EditTaskRecord from './components/EditTaskRecord'
import PageNotFound from './components/PageNotFound'

function App() {
  return (
    <BrowserRouter>
      <Route
        exact
        path="/"
        render={props => (
          <div className="app bg-success pb-5">
            <Timer {...props} />
          </div>
        )}
      />
      <Route
        path="/edit-mastertask"
        render={props => <EditMasterTask {...props} />}
      />
      <Route
        path="/edit-rounds"
        render={props => <EditTaskRecord {...props} />}
      />
      <Route component={PageNotFound} />
    </BrowserRouter>
  )
}

export default App
