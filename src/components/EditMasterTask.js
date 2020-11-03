
import React, { Component } from "react"
import { masterTasksRef } from "../firebase"

class EditMasterTask extends Component {

  state = { 
    masterTasks: [],
    isEidtable: false
   }

  componentDidMount() {
    this.getAllMasterTasks()
  }

  getAllMasterTasks = async () => {
    const allMasterTasks = await masterTasksRef.get()
    let masterTasksList = []
    let masterTaskIds = []
    allMasterTasks.forEach(parentTask => {
      const parentTaskVar = parentTask.data()
      masterTasksList.push(parentTaskVar)
      parentTaskVar['id'] = parentTask.id
      masterTaskIds.push(parentTaskVar['id']);
    })
    this.setState({ 
      masterTasks: masterTasksList,
    })
    console.log(this.state.masterTasks)
  }
  
  render() { 
    return (
      <div>
         <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Focus Time</th>
              <th>Break Time</th>
            </tr>
            {this.state.masterTasks.map((task, index) => (
              <tr key={index}>
                <td>{task.name}</td>
                <td className="text-center">
                    {task.focusTime}
                </td>
                <td className="text-center">
                    {task.breakTime}
                </td>
              </tr>
            ))}
          </thead>
        </table>
      </div>
  )
  }
}
 
export default EditMasterTask;

