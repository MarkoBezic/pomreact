import React, { Component } from 'react'
import { Howl } from 'howler'
import { masterTasksRef, taskRoundsRef } from '../firebase'
import Dashboard from './Dashboard'


const audioClips = [
  {
    sound:
      'http://soundbible.com/mp3/Boxing%20Mma%20Or%20Wrestling%20Bell-SoundBible.com-252285194.mp3',
  },
  {
    sound:
      'http://soundbible.com/mp3/Temple%20Bell-SoundBible.com-756181215.mp3',
  },
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
    taskName: '',
    sessionId: '',
    taskCollectionSize: 0,
    startTime: '',
    createTimerSucces: '',
    masterTasks: [],
    masterTaskIds: [],
  }

  soundPlay = src => {
    const sound = new Howl({
      src,
      html5: true,
    })
    sound.play()
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
      masterTaskIds: masterTaskIds
    })
  }

  componentDidMount() {
    this.intervalID = setInterval(() => this.tick(), 100)
    this.getAllMasterTasks()
  }

  addCompletedTaskRound = () => {
    taskRoundsRef.add({
      parentTaskId: 1, // How do I get this to update with its corresponding masterTask record id?
      taskName: this.state.taskName * 1000 * 60,
      startTime: this.state.startTime * 1000 * 60,
      endTime: new Date(),
    })
  }

  tick = () => {
    if (this.state.focusTime < 1000 && !this.state.onBreak) {
      this.setState(prevState => ({
        onBreak: true,
        focusTime:
          this.state.userFocusTime <= 0
            ? 1500000
            : this.state.userFocusTime * 1000 * 60,
        counter: prevState.counter + 1,
      }))
      this.soundPlay(audioClips[0].sound)
      this.addCompletedTaskRound()
    } else if (this.state.breakTime < 1000 && this.state.onBreak) {
      this.setState({
        onBreak: false,
        breakTime:
          this.state.userBreakTime <= 0
            ? 300000
            : this.state.userBreakTime * 1000 * 60,
      })
      this.soundPlay(audioClips[1].sound)
    } else if (this.state.isRunning && !this.state.onBreak) {
      const now = Date.now()
      this.setState(prevState => ({
        previousTime: now,
        focusTime: prevState.focusTime - (now - this.state.previousTime),
      }))
    } else if (this.state.isRunning && this.state.onBreak) {
      const now = Date.now()
      this.setState(prevState => ({
        previousTime: now,
        breakTime: prevState.breakTime - (now - this.state.previousTime),
      }))
    }
  }

  handleTimer = async () => {
    
    this.setState(prevState => ({
      isRunning: !prevState.isRunning,
    }))
    if (!this.state.isRunning) {
      this.setState({ previousTime: Date.now() })
    }
  }

  handleReset = () => {
    if (!this.state.onBreak) {
      this.setState({
        focusTime:
          this.state.userFocusTime === ''
            ? 1500000
            : this.state.userFocusTime * 1000 * 60,
      })
    } else {
      this.setState({
        breakTime:
          this.state.userBreakTime === ''
            ? 300000
            : this.state.userBreakTime * 1000 * 60,
      })
    }
  }

  handleSkip = () => {
    this.setState({
      onBreak: !this.state.onBreak,
    })
  }

  taskNameInput = React.createRef()
  focusInput = React.createRef()
  breakInput = React.createRef()

  handleInputChange = e => {
    const target = e.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value,
    })
  }
  resumeExistingTimer = (e, name, focusTime, breakTime ) => {
    e.preventDefault()
    let existingFocusTime = focusTime * 1000 * 60
    let existingBreakTime = breakTime * 1000 * 60
    this.setState({
      taskName: name,
      focusTime: existingFocusTime,
      breakTime: existingBreakTime,
    })

  }
  handleSubmit = e => {
    e.preventDefault()
    //assuming that masterTasks have unique names
    const self = this
    
    let newTimerSetState = () => {
      self.setState({
            focusTime: self.state.userFocusTime * 1000 * 60,
            breakTime: self.state.userBreakTime * 1000 * 60,
            taskName: self.state.taskName,
            onBreak: false,
            counter: 0,
            startTime: new Date(),
            createTimerSucces: true,
          })
          self.taskNameInput.current.value = ''
          self.focusInput.current.value = ''
          self.breakInput.current.value = ''
    }
    masterTasksRef
      .where('name', '==', self.state.taskName)
      .get()
      .then(function (querySnapshot) {
        let masterTasks = []
        querySnapshot.forEach(function (doc) {
          console.log(doc.id, ' => ', doc.data())
          masterTasks.push(doc.data())
        })
        if (masterTasks.length === 0) {
          masterTasksRef.doc().set({
            name: self.state.taskName, 
            completedRoundsCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            focusTime: self.state.userFocusTime,
            breakTime: self.state.userBreakTime,
          })
          newTimerSetState()      
        } else {
          self.setState({
            createTimerSucces: false,
          })
          console.log('master task already exists, please rename task')
        }
        console.log('running')
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error)
      })
  }

  render() {
    let time = !this.state.onBreak
      ? Math.floor(this.state.focusTime / 1000)
      : Math.floor(this.state.breakTime / 1000)
    let minutes = Math.floor(time / 60)
    let seconds = time % 60

    seconds = seconds < 10 ? '0' + seconds : seconds
    minutes = minutes < 10 ? '0' + minutes : minutes

    return (
      <>
        <div className={`container ${this.state.onBreak ? 'bg-danger' : ''}`}>
          <div className="row">
            <div className="col d-flex justify-content-center pt-3">
              <form className="" onSubmit={this.handleSubmit}>
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
          {this.state.createTimerSucces === '' ? (
            ''
          ) : this.state.createTimerSucces ? (
            <div className="row">
              <div className="col d-flex justify-content-center">
                <span className="pt-4 text-white font-weight-bold">
                  New timer created
                </span>
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col d-flex justify-content-center">
                <span className="pt-4 text-white font-weight-bold">
                  Timer already exists for this task. Please resume existing
                  timer
                </span>
              </div>
            </div>
          )}
          <div className="row">
            <div className="col d-flex justify-content-center display-4 font-weight-bold text-white pt-4">
              <span>{this.state.taskName ? this.state.taskName : 'Task'}</span>
            </div>
          </div>
          <div className="row">
            <div className="col d-flex justify-content-center p-3">
              <span className="display-2 font-weight-bold text-white">
                {minutes} : {seconds}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-primary btn-lg m-2 p-4 font-weight-bold"
                onClick={this.handleTimer}
              >
                {this.state.isRunning ? 'Stop' : 'Start'}
              </button>
              <button
                type="button"
                className="btn btn-primary btn-lg m-2 p-4 font-weight-bold"
                onClick={this.handleReset}
              >
                Reset
              </button>
              {this.state.onBreak ? (
                <button
                  type="button"
                  className="btn btn-primary btn-lg m-2 p-4 font-weight-bold"
                  onClick={this.handleSkip}
                >
                  Skip
                </button>
              ) : (
                ''
              )}
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
            <div
              div
              className="col d-flex justify-content-center pt-4 text-white"
            >
              <Dashboard 
                {...this.props}
                masterTasks={this.state.masterTasks} 
                resumeExistingTimer={this.resumeExistingTimer}  
                />
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Timer

