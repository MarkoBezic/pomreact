import React, { Component } from 'react';

class Timer extends Component {
  
  state = {
    isRunning: false,
    onBreak: false,
    elapsedTime: 1500000,
    previousTime: 0
  }

  componentDidMount() {
    this.intervalID = setInterval(() => this.tick(), 100)
  }

  tick = () => {
    if(this.state.elapsedTime < 0 && !this.state.onBreak) {
      this.setState({ 
        elapsedTime: 300000,
        onBreak: true
      });
    } else if (this.state.elapsedTime < 0 && this.state.onBreak){
      this.setState({
        elapsedTime: 1500000,
        onBreak: false
      });
    } else if (this.state.isRunning) {
      const now = Date.now()
      this.setState(prevState => ({
        previousTime: now,
        elapsedTime: prevState.elapsedTime - (now - this.state.previousTime)
      }));
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
      this.setState({ elapsedTime: 1500000 });
    } else {
      this.setState({ elapsedTime: 300000 });
    }
    
  }

  render() { 
    let time = Math.floor(this.state.elapsedTime/1000)
    let minutes = Math.floor( time / 60)
    let seconds = time % 60

    seconds = seconds < 10 ? "0" + seconds : seconds
    minutes = minutes < 10 ? "0" + minutes : minutes

    return ( 
      <>
        <div className="container">
          <div className="row">
            <div className="col d-flex justify-content-center p-5">
              <span className="display-3 font-weight-bold text-white">{ minutes } : { seconds }</span>
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