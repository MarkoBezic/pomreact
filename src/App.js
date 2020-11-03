import React from 'react';
import Timer from './components/Timer'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, BrowserRouter }  from 'react-router-dom'
import EditMasterTask from './components/EditMasterTask';

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
        path='/edit-mastertask'
        render={props => <EditMasterTask {...props}/>} />
    </BrowserRouter>
  );
}

export default App;

