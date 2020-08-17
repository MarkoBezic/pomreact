import React, { Component } from 'react'

class Form extends Component {

  render() { 
    return ( 
      <form onSubmit={this.handleSubmit}>
        <label>Task Name: </label>
        <input 
          type='string'
          name='taskName'
          placeholder='Enter Task Name'
        /><br></br>
        <label>Focus Time: </label>
        <input 
          type='number'
          name='userFocusTime'
          placeholder='Enter Focus Minutes'
        /><br></br>
        <label>Break Time: </label>
        <input 
          type='number'
          name='userBreakTime'
          placeholder='Enter Break Minutes'
        /><br></br>
        <input 
          type="submit"
        />
      </form>
     );
  }
}
 
export default Form;