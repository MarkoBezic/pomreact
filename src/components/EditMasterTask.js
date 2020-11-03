
import React, { Component } from "react"
import { masterTasksRef } from "../firebase"

class EditMasterTask extends Component {

  state = { 
    currentMasterTask: {},
    isEidtable: false
   }

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
              <td className="text-center">{this.state.currentMasterTask.focusTime}</td>
              <td className="text-center">{this.state.currentMasterTask.breakTime}</td>
              </tr>
          </thead>
        </table>
      </div>
    )
  }
}
 
export default EditMasterTask;

