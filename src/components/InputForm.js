import React, { Component } from 'react'

class InputForm extends Component {
  state = {}

  render() {
    return (
      <div className="row">
        <div className="col d-flex justify-content-center pt-3">
          <form className="" onSubmit={e => this.handleSubmit(e)}>
            <input
              type="string"
              name="taskName"
              placeholder="Enter Task Name"
              onChange={this.handleInputChange}
              ref={this.taskNameInput}
            />
            <input
              type="number"
              name="userFocusTime"
              placeholder="Enter focus minutes"
              onChange={this.handleInputChange}
              ref={this.focusInput}
            />
            <input
              type="number"
              name="userBreakTime"
              placeholder="Enter break minutes"
              onChange={this.handleInputChange}
              ref={this.breakInput}
            />
            <input type="submit" />
          </form>
        </div>
      </div>
    )
  }
}

export default InputForm
