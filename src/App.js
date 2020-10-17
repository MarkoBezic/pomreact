import React from 'react';
import Timer from './components/Timer'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, BrowserRouter }  from 'react-router-dom'
import EditTaskRecord from './components/EditTaskRecord';

function App() {
  return (
    <BrowserRouter>
        <Route
          exact path='/' 
          render={ props => 
          <div className="app bg-success pb-5">
            <Timer {...props}/>
          </div>}
          /> 
        <Route 
        exact path='/edit-task-record'
        render={props => <EditTaskRecord {...props}/>} />
    </BrowserRouter>
  );
}

export default App;

