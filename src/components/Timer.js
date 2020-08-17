import React, { Component } from 'react';
import {Howl} from 'howler';
import { taskMasterRef, taskDetailRef}  from '../firebase'
import data from '../sampleData'

const audioClips = [
  {sound: 'http://soundbible.com/mp3/Boxing%20Mma%20Or%20Wrestling%20Bell-SoundBible.com-252285194.mp3'},
  {sound: 'http://soundbible.com/mp3/Temple%20Bell-SoundBible.com-756181215.mp3'}
]
class Timer extends Component {
  
  state = {
    isRunning: false,
    onBreak: false,
    previousTime: 0,
    counter: 0,
    focusTime: 1500000,
    breakTime: 300000,
    userFocusTime: '',
    userBreakTime: '',
    taskName: ''

  }

  soundPlay = (src) => {
    const sound = new Howl ({ 
      src,
      html5: true
     })
     sound.play();
  }

  componentDidMount() {
    this.intervalID = setInterval(() => this.tick(), 100)
    console.log(taskDetailRef);
  }

  // from stackoverflow (https://stackoverflow.com/questions/4689856/how-to-change-value-of-object-which-is-inside-an-array-using-javascript-or-jquer)
  updateRoundsTotal = (taskName, rounds) => {
    for(var i in data.tasks) {
      if(data.tasks[i].taskName === taskName) {
        data.tasks[i].rounds = rounds + 1;
        break;
      }
    }
  }

  tick = () => {
    if (this.state.focusTime < 1000 && !this.state.onBreak) {
       this.setState(prevState => ({ 
        onBreak: true,
        focusTime: this.state.userFocusTime <= 0 ? 1500000 : this.state.userFocusTime * 1000 * 60,
        counter: prevState.counter + 1
      }));
      this.soundPlay(audioClips[0].sound);
      this.updateRoundsTotal(this.state.taskName, this.state.counter);
    } else if (this.state.breakTime < 1000 && this.state.onBreak){
      this.setState({
        onBreak: false,
        breakTime: this.state.userBreakTime <= 0 ? 300000 : this.state.userBreakTime * 1000 * 60
      });
      this.soundPlay(audioClips[1].sound);
    } else if (this.state.isRunning && !this.state.onBreak) {
      const now = Date.now()
      this.setState(prevState => ({
        previousTime: now,
        focusTime: prevState.focusTime - (now - this.state.previousTime)
      }));
    } else if (this.state.isRunning && this.state.onBreak) {
      const now = Date.now()
      this.setState(prevState => ({
        previousTime: now,
        breakTime: prevState.breakTime - (now - this.state.previousTime)
      }))
    }
  }

  handleTimer = () => {
    this.setState(prevState => ({
      isRunning: !prevState.isRunning
    }));
    if (!this.state.isRunning) {
      this.setState({ previousTime: Date.now() });
    }
  }

  handleReset = () => {
    if (!this.state.onBreak) {
      this.setState({ focusTime: this.state.userFocusTime === "" ? 1500000 : this.state.userFocusTime * 1000 * 60});
    } else {
      this.setState({ breakTime: this.state.userBreakTime === "" ? 300000 : this.state.userBreakTime * 1000 * 60});
    }
  }

  handleSkip = () => {
    this.setState({ 
      onBreak: !this.state.onBreak
     })
  }
 
  taskNameInput = React.createRef()
  focusInput = React.createRef()
  breakInput = React.createRef()

  handleInputChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    this.setState({ 
      [name]: value
    });
 }

  handleSubmit = (e) => {
    e.preventDefault();
    const today = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'}).format(Date.now())
    const newId = data.tasks.length + 1
    this.setState({ 
      focusTime: this.state.userFocusTime * 1000 * 60,
      breakTime: this.state.userBreakTime * 1000 * 60,
      taskName: this.state.taskName
     })
     //adding record to tasks array
     data.tasks.push({
          id: newId,
          taskName: this.state.taskName,
          date: today,
          rounds: 0,
          focusMinutes: parseInt(this.state.userFocusTime),
          breakMinutes: parseInt(this.state.userBreakTime),
     })
     console.log(data.tasks[3])
     //creates record in firebase
      //TODO: if task name already exists and date matches today's date then update rounds, otherwise create new task session entry
    //  taskDetailRef.add({
    //    id: 4,
    //    taskName: this.state.taskName,
    //    date: today,
    //    rounds: this.state.counter
    //  })
    
    this.taskNameInput.current.value = ''
    this.focusInput.current.value = ''
    this.breakInput.current.value = ''
  }

  render() { 
    let time = !this.state.onBreak ? Math.floor(this.state.focusTime/1000) : Math.floor(this.state.breakTime/1000)
    let minutes = Math.floor( time / 60)
    let seconds = time % 60

    seconds = seconds < 10 ? "0" + seconds : seconds
    minutes = minutes < 10 ? "0" + minutes : minutes

    return ( 
      <>
        <div className={`container ${this.state.onBreak ? 'bg-danger' : ''}`}>
          <div className="row">
            <div className="col d-flex justify-content-center pt-3">
              <form 
                className=""
                onSubmit={this.handleSubmit}>
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
                <input 
                  type="submit"
                />
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col d-flex justify-content-center display-4 font-weight-bold text-white pt-4">
              <span>{this.state.taskName ? this.state.taskName : 'Task'}</span>
            </div>
          </div>
          <div className="row">
            <div className="col d-flex justify-content-center p-3">
              <span className="display-2 font-weight-bold text-white">{ minutes } : { seconds }</span>
            </div>
          </div>
          <div className="row">
            <div className="col d-flex justify-content-center">
              <button type="button" className="btn btn-primary btn-lg m-2 p-4 font-weight-bold" onClick={this.handleTimer}> 
              { this.state.isRunning ? 'Stop' : 'Start' }
              </button>
              <button type="button" className="btn btn-primary btn-lg m-2 p-4 font-weight-bold" onClick={this.handleReset}>Reset</button>
              {this.state.onBreak ? <button type="button" className="btn btn-primary btn-lg m-2 p-4 font-weight-bold" onClick={this.handleSkip}>Skip</button> : ''}
            </div>
          </div>
          <div className="row">
              <div className="col d-flex justify-content-center">
                <p className="font-weight-bold text-white pt-4">
                  Rounds Completed: {this.state.counter}
                </p>
              </div>
            </div>
          <div className="row">
            <div div className="col d-flex justify-content-center pt-4 text-white">
               <table>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th className="pr-3">Total Rounds:</th>
                    <th>Edit</th>
                    <th>Resume</th>
                    <th>Delete</th>
                  </tr>
                  {data.tasks.map((task, index) => (
                  <tr key={index}>
                    <td>{task.taskName}: </td>
                    <td className="text-center">{task.rounds}</td>
                    <td><button className="btn btn-primary ml-1 mr-1 mt-1">Edit</button></td>
                    <td><button className="btn btn-primary ml-1 mr-1 mt-1">Resume</button></td>
                    <td><button className="btn btn-primary ml-1 mr-1 mt-1">Delete</button></td>
                  </tr>
                  ))}
                </thead>
              </table>
            </div>  
          </div>   
        </div>
      </>
     );
  }
}

 
export default Timer;