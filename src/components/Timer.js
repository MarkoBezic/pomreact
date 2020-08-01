import React, { Component } from 'react';
import {Howl} from 'howler';

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
    userFocusTime: "",
    userBreakTime: ""
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
  }

  tick = () => {
    if (this.state.focusTime < 1000 && !this.state.onBreak) {
       this.setState(prevState => ({ 
        onBreak: true,
        focusTime: this.state.userFocusTime <= 0 ? 1500000 : this.state.userFocusTime * 1000 * 60,
        counter: prevState.counter + 1
      }));
      this.soundPlay(audioClips[0].sound);
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
      //
    } else {
      this.setState({ breakTime: this.state.userBreakTime === "" ? 300000 : this.state.userBreakTime * 1000 * 60});
      //
    }
  }

  handleFocusTime = (userTime) => {
    this.setState({
      focusTime: userTime
    });
  }

  handleBreakTime = (userTime) => {
    this.setState({
      breakTime: userTime
    });
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
    this.setState({ 
      focusTime: this.state.userFocusTime * 1000 * 60,
      breakTime: this.state.userBreakTime * 1000 * 60
     })
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
              <form onSubmit={this.handleSubmit}>
                <input 
                  type="number"
                  name="userFocusTime"
                  placeholder="Enter focus minutes"
                  onChange={this.handleTimeChange}
                  value={this.state.userFocusTime}
                />
                <input 
                  type="number"
                  name="userBreakTime"
                  placeholder="Enter break minutes"
                  onChange={this.handleTimeChange}
                  value={this.state.userBreakTime}
                />
                <input 
                  type="submit"
                />
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col d-flex justify-content-center pt-5">
              <span className="display-4 font-weight-bold text-white">
                Rounds Completed: {this.state.counter}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col d-flex justify-content-center p-5">
              <span className="display-2 font-weight-bold text-white">{ minutes } : { seconds }</span>
            </div>
          </div>
          <div className="row">
            <div className="col d-flex justify-content-center">
              <button type="button" className="btn btn-primary btn-lg m-2 p-4 font-weight-bold" onClick={this.handleTimer}> 
              { this.state.isRunning ? 'Stop' : 'Start' }
              </button>
              <button type="button" className="btn btn-primary btn-lg m-2 p-4 font-weight-bold" onClick={this.handleReset}>Reset</button>
            </div>
          </div>
        </div>
        
      </>
     );
  }
}
 
export default Timer;