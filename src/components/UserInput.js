import React, { Component } from 'react';

class UserInput extends Component {
  state = { 
      focusTime: '',
      breakTime: ''
   }

   handleTimeChange = (e) => {
      const target = e.target;
      const value = target.value;
      const name = target.name;
      this.setState({ 
        [name]: value
      });
   }

   handleSubmit = (e) => {
     e.preventDefault();
     this.props.focusTime(
      this.state.focusTime
      );      
   }
 

  render() { 
    return ( 
      <form onSubmit={this.handleSubmit}>
        <input 
          type="number"
          name="focusTime"
          placeholder="Enter Focused Time"
          onChange={this.handleTimeChange}
          value={this.state.focusTime}
        />
        <input 
          type="number"
          name="breakTime"
          placeholder="Enter Break Time"
          onChange={this.handleTimeChange}
          value={this.state.breakTime}
        />
        <input 
          type="submit"
        />
      </form>
     );
  }
}
 
export default UserInput;