import React, { Component } from 'react'
import { Link } from 'react-router-dom';

class Dashboard extends Component {

    redirectToEdit = (e, taskId) => {
      e.preventDefault()
      this.props.history.push(`/edit-mastertask`, taskId)
    }

    redirectToEditRounds = (e, taskId, taskName) => {
      e.preventDefault()
      let taskRoundObj = {
        taskId: taskId,
        taskName: taskName
      }
      this.props.history.push(`/edit-rounds`, taskRoundObj)
    }
   
  render() { 
  return (  
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th className="pr-3">Total Rounds:</th>
            <th>Edit</th>
            <th>Resume</th>
            <th>Delete</th>
          </tr>
          {this.props.masterTasks.map((task, index) => (
            <tr key={index}>
              <td>{task.name} </td>
              <td className="text-center">
                <Link to="/edit-rounds"  
                      className="text-white"
                      onClick={(e)=> this.redirectToEditRounds(e, task.id, task.name)}
                      >{task.completedRoundsCount}</Link>
                </td>
              <td>
                <button className="btn btn-primary ml-1 mr-1 mt-1"
                        onClick={(e) => this.redirectToEdit(e, task.id)}
                  >Edit
                </button>
              </td>
              <td>
                <button className="btn btn-primary ml-1 mr-1 mt-1" 
                  onClick={(e) =>  
                  {
                    const {name, focusTime, breakTime, id} = task
                    this.props.handleResumeExistingTimer(e, name, focusTime, breakTime, id)
                    }}
                    >Resume
                </button>
              </td>
              <td>
                <button className="btn btn-primary ml-1 mr-1 mt-1"
                        onClick={(e) => {
                          this.props.handleDeleteTimer(e, task.id)
                        }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </thead>
      </table>
    );
  }
}
 
export default Dashboard;