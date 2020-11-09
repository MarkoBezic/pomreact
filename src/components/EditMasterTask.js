import React, { Component } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { masterTasksRef } from '../firebase'

class EditMasterTask extends Component {
  state = {
    currentMasterTask: {},
    isEidtable: true,
    focusTime: '',
    breakTime: '',
    emptyInputs: false,
  }

  inputRef = React.createRef()

  componentDidMount() {
    this.getCurrentMasterTask()
  }

  getCurrentMasterTask = () => {
    let id = this.props.history.location.state
    let masterTaskDocRef = masterTasksRef.doc(id)
    masterTaskDocRef
      .get()
      .then(doc => {
        if (doc.exists) {
          this.setState({
            currentMasterTask: doc.data(),
          })
        } else {
          console.log('No such document')
        }
      })
      .then(() => {
        this.setState({
          focusTime: this.state.currentMasterTask.focusTime,
          breakTime: this.state.currentMasterTask.breakTime,
        })
      })
      .catch(error => {
        console.log('Error getting document: ', error)
      })
  }

  handleInputChange = e => {
    const target = e.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value,
    })
  }

  redirectToTimer = () => {
    this.props.history.push('/')
  }

  handleSave = () => {
    if (this.state.focusTime === '' || this.state.breakTime === '') {
      this.setState({
        emptyInputs: true,
      })
    } else if (this.state.focusTime > 0 || this.state.breakTime > 0) {
      let id = this.props.history.location.state
      const masterTask = masterTasksRef.doc(id)
      masterTask.update({
        focusTime: this.state.focusTime,
        breakTime: this.state.breakTime,
        updatedAt: new Date(),
      })
      this.getCurrentMasterTask()
      this.setState({
        isEidtable: false,
        emptyInputs: false,
      })
      confirmAlert({
        title: 'Updates saved successfully',
        message: 'Return to timer',
        buttons: [
          {
            label: 'Okay',
            onClick: () => {
              this.redirectToTimer()
            },
          },
        ],
      })
    }
  }

  handleEdit = () => {
    this.setState({
      isEidtable: true,
    })
  }

  render() {
    return (
      <div>
        {this.state.emptyInputs ? (
          <h4 className="text-danger pl-5 pt-3">
            Both fields must have a number!
          </h4>
        ) : (
          ''
        )}
        <table>
          <thead>
            <tr>
              <th className="p-3">Task</th>
              <th className="p-3">Focus Minutes</th>
              <th className="p-3">Break Minutes</th>
            </tr>
            <tr>
              <td className="text-center">
                {this.state.currentMasterTask.name}
              </td>
              {this.state.isEidtable ? (
                <>
                  <td className="text-center">
                    <input
                      type="number"
                      name="focusTime"
                      placeholder={this.state.currentMasterTask.focusTime}
                      onChange={this.handleInputChange}
                      ref={this.inputRef}
                    ></input>
                  </td>
                  <td className="text-center">
                    <input
                      type="number"
                      name="breakTime"
                      placeholder={this.state.currentMasterTask.breakTime}
                      onChange={this.handleInputChange}
                      ref={this.inputRef}
                    ></input>
                  </td>
                  <button
                    className="btn btn-primary ml-1 mr-1 mt-1"
                    onClick={() => {
                      this.handleSave()
                    }}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <td className="text-center">{this.state.focusTime}</td>
                  <td className="text-center">{this.state.breakTime}</td>
                  <button
                    className="btn btn-primary ml-1 mr-1 mt-1"
                    onClick={() => {
                      this.handleEdit()
                    }}
                  >
                    Edit
                  </button>
                </>
              )}
            </tr>
          </thead>
        </table>
      </div>
    )
  }
}

export default EditMasterTask
