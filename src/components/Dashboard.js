import React, { Component } from 'react'

class Dashboard extends Component {

    redirectToEdit = () => {
      this.props.history.push(`/edit-mastertask-record`)
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
                {task.completedRoundsCount}
                </td>
              <td>
                {/* add functionality to edit a record */}
                <button className="btn btn-primary ml-1 mr-1 mt-1"
                        onClick={this.redirectToEdit}
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