
import React, { Component } from "react"
import { masterTasksRef } from "../firebase"

class EditMasterTask extends Component {

  state = { 
    currentMasterTask: {},
    isEidtable: true,
    focusTime: "",
    breakTime: "",
   }

  inputRef = React.createRef()

  componentDidMount() {
    this.getCurrentMasterTask()
  }

  getCurrentMasterTask = () => {
    let id = this.props.history.location.state
    let masterTaskDocRef = masterTasksRef.doc(id)
    masterTaskDocRef.get().then((doc)=> {
      if (doc.exists) {
        this.setState({
          currentMasterTask: doc.data()
        })
      } else {
        console.log("No such document")
      }
    }).catch((error) => {
      console.log("Error getting document: ", error)
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

  handleSave = () => {
    let id = this.props.history.location.state
    const masterTask = masterTasksRef.doc(id)
    masterTask.update({
      focusTime: this.state.focusTime,
      breakTime: this.state.breakTime,
      updateAt: new Date(),
    })
    this.setState({
      isEidtable: false,
    })
    this.getCurrentMasterTask()
    //@marko todo: create alert confirm changes have been saved
  }

  handleEdit = () => {
    this.setState({
      isEidtable: true
    })
  }
  
  render() { 
    return (
      <div>
         <table>
          <thead>
            <tr>
              <th className="p-3">Task</th>
              <th className="p-3">Focus Minutes</th>
              <th className="p-3">Break Minutes</th>
            </tr>
            <tr>
              <td className="text-center">{this.state.currentMasterTask.name}</td>
              {this.state.isEidtable ? (
                <>
                  <td className="text-center">
                  <input
                    type="number"
                    name="focusTime"
                    placeholder={this.state.currentMasterTask.focusTime}
                    onChange={this.handleInputChange}
                    ref={this.inputRef}>
                  </input>
                </td>
                <td className="text-center"> 
                  <input
                    type="number"
                    name="breakTime"
                    placeholder={this.state.currentMasterTask.breakTime}
                    onChange={this.handleInputChange}
                    ref={this.inputRef}>
                  </input>
                </td>
                  <button className="btn btn-primary ml-1 mr-1 mt-1"
                    onClick={()=> {this.handleSave()}}
                  >Save</button>
                
              </>
              ) : (
              <>
                <td className="text-center">
                {this.state.focusTime}
              </td>
              <td className="text-center"> 
              {this.state.breakTime}
              </td>
                <button className="btn btn-primary ml-1 mr-1 mt-1"
                  onClick={()=> {this.handleEdit()}}
                >Edit</button>
                {/* //@marko todo: add button to return to hompage */}
              </>
              )}
              </tr>
          </thead>
        </table>
      </div>
    )
  }
}
 
export default EditMasterTask;

