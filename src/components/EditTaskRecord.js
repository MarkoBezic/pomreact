import React, { Component } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { taskRoundsRef } from '../firebase'

/// Version 2 of editable component ////
/// contentEditable function from: https://medium.com/@vraa/inline-edit-using-higher-order-components-in-react-7828687c120c


////// Version 1 of eidtable task records: /////

class EditTaskRecord extends Component {

  state = {
    taskRoundsList: [],
    taskRoundsIds: [],
    isEidtable: false, 
    selectedTask: '',
    taskName: '',
    startTime: '',
    endTime: '',
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
  
  makeEditable = (e, id, name, startTime, endTime) => {
    e.preventDefault()
    this.setState({
      selectedTask: id,
      isEidtable: true,
      taskName: name,
      startTime: startTime,
      endTime: endTime,
    })
  }

  inputRef = React.createRef()

  handleInputChange = e => {
    const target = e.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value,
    })
    
  }

  saveEdits = (e, id)  => {
    e.preventDefault()
    const taskRounds = taskRoundsRef.doc(id)
    const taskObj = {
      endTime: this.state.endTime,
      parentTaskId: id,
      startTime: this.state.startTime,
      taskName: this.state.taskName,
    } 
    taskRounds.update({
      taskName: this.state.taskName,
      startTime: this.state.startTime,
      endTime: this.state.endTime
    })
    this.setState({
      isEidtable: false,
      taskRoundsList: [
        taskObj, ...this.state.taskRoundsList.filter(round => {
          return round.id !== id
        })
      ]
    })
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
                {this.state.isEidtable && this.state.selectedTask === task.id ? 
                <>
                  <td>
                    <input type="text"
                           name="taskName" 
                           placeholder={task.taskName}
                           onChange={this.handleInputChange}
                           ref={this.inputRef}
                           ></input>
                  </td>
                  <td className="text-center">
                    <input type="text" 
                            name="startTime"
                            placeholder={task.startTime}
                            onChange={this.handleInputChange}
                            ref={this.inputRef}
                            ></input>
                  </td>
                  <td className="text-center">
                    <input type="text" 
                            name="endTime"
                            placeholder={task.startTime}
                            onChange={this.handleInputChange}
                            ref={this.inputRef}
                            ></input>
                  </td>
                  <button className="btn btn-primary ml-1 mr-1 mt-1"
                          onClick={(e) => {this.saveEdits(e, task.id)}}
                    >
                    Save
                  </button>
                </>
                 : 
                 <>
                  <td>{task.taskName} </td>
                  <td className="text-center">
                    {task.startTime}
                  </td>
                  <td className="text-center">
                    {task.endTime}
                  </td>
                  <td>
                  <button className="btn btn-primary ml-1 mr-1 mt-1"
                          onClick={(e) => {this.makeEditable(e, task.id, task.taskName, task.startTime, task.endTime)}}
                    >Edit
                  </button>
                </td>
                </>
                }
                
                <td>
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
