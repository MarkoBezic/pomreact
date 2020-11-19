import React, { Component } from 'react'
import { Howl } from 'howler'
import { masterTasksRef, taskRoundsRef } from '../firebase'
import Dashboard from './Dashboard'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { AuthConsumer } from './AuthContext'

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
    initialState: true,
    isRunning: false,
    onBreak: false,
    previousTime: 0,
    counter: 0,
    focusTime: 1500000,
    breakTime: 300000,
    userFocusTime: '',
    userBreakTime: '',
    taskName: '',
    startTime: '',
    createTimerSucces: '',
    createdAt: '',
    masterTasks: [],
    masterTaskIds: [],
    currentMasterTaskId: '',
    taskRoundsList: [],
    taskRoundsIds: [],
    user: '',
  }
  componentDidMount() {
    this.intervalID = setInterval(() => this.tick(), 100)
    this.rollUpRoundsTotalToMasterTasks()
    this.getAllMasterTasks(this.props.match.params.userId)
    this.getAllTaskRoundDetails()
  }

  componentDidUpdate() {
    this.getAllMasterTasks(this.props.match.params.userId)
  }

  rollUpRoundsTotalToMasterTasks = async () => {
    //get all masterTasks
    const allMasterTasks = await masterTasksRef.get()
    let parentTaskIdsFromRounds = []

    // for each masterTask ID, check how many docs exist in taskRoundEntry that match with the parentTaskId
    allMasterTasks.forEach(async parentTask => {
      const allTaskRoundEntries = await taskRoundsRef.get()
      //count function taken from: https://www.youtube.com/watch?v=P3gJr_Rd80g
      const count = (arr, val) => {
        return arr.reduce((acc, elm) => {
          return val === elm ? acc + 1 : acc
        }, 0)
      }
      // push all parentTaskIds in array parentTaskIdsFromRounds
      allTaskRoundEntries.forEach(taskRound => {
        const taskRoundVar = taskRound.data()
        parentTaskIdsFromRounds.push(taskRoundVar.parentTaskId)
      })

      // count how many times a specific masterTask ID appears the array stored in parentTaskIdsFromRounds

      let completedRoundsCountVar = count(
        parentTaskIdsFromRounds,
        parentTask.id
      )

      // set total number of IDs found in the array to masterTasks completedRundsCounts field in firebase

      const masterTask = masterTasksRef.doc(parentTask.id)
      masterTask.update({
        completedRoundsCount: completedRoundsCountVar,
      })

      // clear partTaskIdsFromRounds array
      parentTaskIdsFromRounds = []
    })
  }

  soundPlay = src => {
    const sound = new Howl({
      src,
      html5: true,
    })
    sound.play()
  }

  getAllMasterTasks = async userId => {
    try {
      const allMasterTasks = await masterTasksRef
        .where('user', '==', userId)
        .orderBy('createdAt')
        .get()
      let masterTasksList = []
      let masterTaskIds = []
      allMasterTasks.forEach(parentTask => {
        const parentTaskVar = parentTask.data()
        masterTasksList.push(parentTaskVar)
        parentTaskVar['id'] = parentTask.id
        masterTaskIds.push(parentTaskVar['id'])
      })
      this.setState({
        masterTasks: masterTasksList,
        masterTaskIds: masterTaskIds,
      })
    } catch (error) {
      console.log(error)
    }
  }

  getCurrentMasterTaskId = async () => {
    await masterTasksRef
      .where('name', '==', this.state.taskName)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState({
            currentMasterTaskId: doc.id,
          })
        })
      })
      .catch(error => {
        console.log('Error getting documents: ', error)
      })
  }

  handleUpdatedAt = id => {
    masterTasksRef.doc(id).update({
      updatedAt: new Date(),
    })
  }

  addCompletedTaskRound = () => {
    const id = this.state.currentMasterTaskId
    taskRoundsRef.add({
      parentTaskId: id,
      taskName: this.state.taskName,
      startTime: this.state.startTime,
      endTime: new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
      }),
    })
    this.rollUpRoundsTotalToMasterTasks()
    this.handleUpdatedAt(id)
  }

  getAllTaskRoundDetails = async () => {
    const allTaskRoundDetails = await taskRoundsRef.get()
    let taskRoundsList = []
    let taskRoundsIds = []
    allTaskRoundDetails.forEach(taskRound => {
      const taskRoundVar = taskRound.data()
      taskRoundsList.push(taskRoundVar)
      taskRoundVar['id'] = taskRound.id
      taskRoundsIds.push(taskRoundVar['id'])
    })
    this.setState({
      taskRoundsList: taskRoundsList,
      taskRoundsIds: taskRoundsIds,
    })
  }

  tick = () => {
    if (this.state.focusTime < 1000 && !this.state.onBreak) {
      this.setState(prevState => ({
        onBreak: true,
        focusTime:
          this.state.userFocusTime <= 0 ? 1500000 : this.state.userFocusTime,
        counter: prevState.counter + 1,
      }))
      this.soundPlay(audioClips[0].sound)
      this.addCompletedTaskRound()
    } else if (this.state.breakTime < 1000 && this.state.onBreak) {
      this.setState({
        onBreak: false,
        breakTime:
          this.state.userBreakTime <= 0 ? 300000 : this.state.userBreakTime,
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
      this.setState({
        previousTime: Date.now(),
        startTime: new Date().toLocaleString('en-US', {
          timeZone: 'America/New_York',
        }),
      })
    }
  }

  handleReset = () => {
    this.setState({
      focusTime:
        this.state.userFocusTime === '' ? 1500000 : this.state.userFocusTime,
      breakTime:
        this.state.userBreakTime === '' ? 300000 : this.state.userBreakTime,
    })
    if (this.state.onBreak) {
      this.setState({
        onBreak: false,
      })
    }
  }

  handleSkip = () => {
    this.setState({
      onBreak: !this.state.onBreak,
    })
    this.handleReset()
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

  handleResumeExistingTimer = (e, name, focusTime, breakTime, id) => {
    e.preventDefault()
    let existingFocusTime = focusTime * 1000 * 60
    let existingBreakTime = breakTime * 1000 * 60
    this.setState({
      taskName: name,
      focusTime: existingFocusTime,
      breakTime: existingBreakTime,
      userFocusTime: existingFocusTime,
      userBreakTime: existingBreakTime,
      currentMasterTaskId: id,
      initialState: false,
    })
  }

  handleDeleteTimer = (e, id) => {
    e.preventDefault()
    confirmAlert({
      title: 'Please confirm',
      message: 'Are you sure you want to delete this task?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const task = masterTasksRef.doc(id)
            this.setState({
              masterTasks: [
                ...this.state.masterTasks.filter(task => {
                  return task.id !== id
                }),
              ],
            })
            task
              .delete()
              .then(function () {
                console.log('Document successfully deleted!')
              })
              .catch(function (error) {
                console.error('Error removing document: ', error)
              })
          },
        },
        {
          label: 'No',
          onClick: () => alert('Maybe next time! :)'),
        },
      ],
    })
  }

  handleSubmit = (e, userId) => {
    e.preventDefault()
    //assuming that masterTasks have unique names
    const self = this

    let getCurrentMasterTaskId = async () => {
      await masterTasksRef
        .where('name', '==', self.state.taskName)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            self.setState({
              currentMasterTaskId: doc.id,
            })
          })
        })
        .catch(error => {
          console.log('Error getting documents: ', error)
        })
    }

    let newTimerSetState = () => {
      self.setState({
        focusTime: self.state.userFocusTime * 60000,
        breakTime: self.state.userBreakTime * 60000,
        userFocusTime: self.state.userFocusTime * 60000,
        userBreakTime: self.state.userBreakTime * 60000,
        taskName: self.state.taskName,
        onBreak: false,
        counter: 0,
        createdAt: new Date(),
        createTimerSucces: true,
        user: userId,
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
        if (masterTasks[0].user != self.state.user) {
          const newTask = {
            name: self.state.taskName,
            completedRoundsCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            focusTime: self.state.userFocusTime,
            breakTime: self.state.userBreakTime,
            user: userId,
          }
          masterTasksRef.doc().set(newTask)
          newTimerSetState()
          getCurrentMasterTaskId()
          self.setState({
            masterTasks: [...self.state.masterTasks, newTask],
            initialState: false,
          })
        } else {
          self.setState({
            createTimerSucces: false,
          })
          console.log('master task already exists, please rename task')
        }
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
      <AuthConsumer>
        {({ user }) => (
          <>
            <div
              className={`container ${this.state.onBreak ? 'bg-danger' : ''}`}
            >
              <div className="row">
                <div className="col d-flex justify-content-center pt-3">
                  <form
                    className=""
                    onSubmit={e => this.handleSubmit(e, user.id)}
                  >
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
                  <span>
                    {this.state.taskName
                      ? this.state.taskName
                      : 'Enter timer details'}
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col d-flex justify-content-center p-3">
                  <span className="display-2 font-weight-bold text-white">
                    {this.state.initialState
                      ? '00:00'
                      : `${minutes} : ${seconds}`}
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col d-flex justify-content-center">
                  {this.state.taskName ? (
                    <>
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
                    </>
                  ) : (
                    ' '
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col d-flex justify-content-center">
                  <p className="font-weight-bold text-white pt-4">
                    Rounds completed this session: {this.state.counter}
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
                    handleResumeExistingTimer={this.handleResumeExistingTimer}
                    handleDeleteTimer={this.handleDeleteTimer}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </AuthConsumer>
    )
  }
}

export default Timer
