import React, { Component } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { taskRoundsRef } from '../firebase'


class EditTaskRecord extends Component {

  state = {
    taskRoundsList: [],
    taskRoundsIds: []
  }
  componentDidMount() {
    this.getAllTaskRoundDetails()
  }

  getAllTaskRoundDetails = async () => {
    const allTaskRoundDetails = await taskRoundsRef.get()
    let taskRoundsList = []
    let taskRoundsIds = []
    allTaskRoundDetails.forEach(taskRound => {
      const taskRoundVar = taskRound.data()
      taskRoundsList.push(taskRoundVar)
      taskRoundVar['id'] = taskRound.id
      taskRoundsIds.push(taskRoundVar['id']);
    })
    this.setState({ 
      taskRoundsList: taskRoundsList,
      taskRoundsIds: taskRoundsIds
    })
  }

  handleDeleteRound = (e, id) => {
    e.preventDefault()
    confirmAlert({
      title: 'Please confirm',
      message: 'Are you sure you want to delete this round?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const taskRound = taskRoundsRef.doc(id)
            this.setState({
              taskRoundsList: [
                ...this.state.taskRoundsList.filter(round => {
                  return round.id !== id
                })
              ]
            })
            taskRound.delete().then(function() {
                console.log("Document successfully deleted!");
              }).catch(function(error) {
                console.error("Error removing document: ", error);
              });
          }
        },
        {
          label: 'No',
          onClick: () => alert("Maybe next time! :)")
        }
      ]
    });
  }
  render() {
    return (
      <div>
         <table>
          <thead>
            <tr>
              <th>Task</th>
              <th className="pr-3">Start Time</th>
              <th>End Time</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
            {this.state.taskRoundsList.map((task, index) => (
              <tr key={index}>
                <td>{task.taskName} </td>
                <td className="text-center">
                  {task.startTime}
                </td>
                <td className="text-center">
                  {task.endTime}
                </td>
                <td>
                  {/* add functionality to edit a record */}
                  <button className="btn btn-primary ml-1 mr-1 mt-1"
                          onClick={this.redirectToEdit}
                    >Edit
                  </button>
                </td>
                <td>
                  {/* add functionality to delete a record */}
                  <button className="btn btn-primary ml-1 mr-1 mt-1"
                          onClick={(e) => {
                            this.handleDeleteRound(e, task.id)
                          }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </thead>
        </table>
      </div>
  )
  }
  
}

export default EditTaskRecord
