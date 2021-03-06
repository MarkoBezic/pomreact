import React, { Component } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { masterTasksRef, taskRoundsRef } from '../firebase'

class EditTaskRecord extends Component {
  state = {
    taskRoundsList: [],
    taskRoundsIds: [],
    isEidtable: false,
    taskName: '',
    startTime: '',
    endTime: '',
    currentTaskId: '',
    warning: false,
  }
  componentDidMount() {
    this.getAllTaskRoundDetails()
    this.setState({
      currentTaskId: this.props.history.location.state.taskId,
      taskName: this.props.history.location.state.taskName,
    })
  }

  getAllTaskRoundDetails = async () => {
    const allTaskRoundDetails = await taskRoundsRef.get()
    let taskRoundsList = []
    let taskRoundsIds = []
    allTaskRoundDetails.forEach(taskRound => {
      const taskRoundVar = taskRound.data()
      taskRoundsList.push(taskRoundVar)
      taskRoundVar['id'] = taskRound.id
      taskRoundsIds.push(taskRoundVar['id'])
    })
    this.setState({
      taskRoundsList: taskRoundsList,
      taskRoundsIds: taskRoundsIds,
    })
  }

  handleUpdatedAt = id => {
    masterTasksRef.doc(id).update({
      updatedAt: new Date(),
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
            this.handleUpdatedAt(this.state.currentTaskId)
            const taskRound = taskRoundsRef.doc(id)
            this.setState({
              taskRoundsList: [
                ...this.state.taskRoundsList.filter(round => {
                  return round.id !== id
                }),
              ],
            })
            taskRound
              .delete()
              .then(function () {
                console.log('Document successfully deleted!')
              })
              .catch(function (error) {
                console.error('Error removing document: ', error)
              })
          },
        },
        {
          label: 'No',
          onClick: () => alert('Maybe next time! :)'),
        },
      ],
    })
  }

  // startInputRef = React.createRef()
  // endInputRef = React.createRef()

  handleInputChange = e => {
    const target = e.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value,
      warning: false,
    })
  }
  handleSaveRound = () => {
    if (this.state.startTime !== '' && this.state.endTime !== '') {
      taskRoundsRef.add({
        parentTaskId: this.state.currentTaskId,
        taskName: this.state.taskName,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
      })
      this.handleUpdatedAt(this.state.currentTaskId)
      this.setState({
        isEidtable: false,
        warning: false,
      })
      this.getAllTaskRoundDetails()
    } else {
      this.setState({
        warning: true,
      })
    }
  }

  handleAddRound = () => {
    this.setState({
      isEidtable: true,
      startTime: '',
      endTime: '',
    })
  }

  render() {
    return (
      <div>
        {this.state.warning ? <p>Cannont have empty field</p> : ''}
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th className="pr-3">Start Time</th>
              <th>End Time</th>
              <th>Delete</th>
            </tr>
            {this.state.taskRoundsList.map((task, index) => (
              <tr key={index}>
                {this.state.currentTaskId === task.parentTaskId ? (
                  <>
                    <td>{task.taskName} </td>
                    <td className="text-center">{task.startTime}</td>
                    <td className="text-center">{task.endTime}</td>
                    <td>
                      <button
                        className="btn btn-primary ml-1 mr-1 mt-1"
                        onClick={e => {
                          this.handleDeleteRound(e, task.id)
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                ) : (
                  ''
                )}
              </tr>
            ))}
            {this.state.isEidtable ? (
              <tr>
                <td>{this.state.taskName}</td>
                <td>
                  <input
                    className="m-1"
                    type="datetime-local"
                    name="startTime"
                    placeholder="mm/dd/yyy, hh:mm:ss AM/PM"
                    onChange={this.handleInputChange}
                    // ref={this.startInputRef}
                  />
                </td>
                <td>
                  <input
                    className="m-1"
                    type="datetime-local"
                    name="endTime"
                    placeholder="mm/dd/yyy, hh:mm:ss AM/PM"
                    onChange={this.handleInputChange}
                    // ref={this.endInputRef}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-primary ml-1 mr-1 mt-1"
                    onClick={() => {
                      this.handleSaveRound()
                    }}
                  >
                    Save
                  </button>
                </td>
              </tr>
            ) : (
              ''
            )}
          </thead>
        </table>
        <button
          className="btn btn-primary ml-1 mr-1 mt-1"
          onClick={() => {
            this.handleAddRound()
          }}
        >
          Add Round
        </button>
      </div>
    )
  }
}

export default EditTaskRecord
