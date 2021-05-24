import logo from './logo.svg';
import tedi from './tedi.jpeg';

//import { Button, Image, Header, Divider, Grid, Dropdown } from 'semantic-ui-react';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import './App.css';

import {useState,useEffect} from 'react';
import TimePicker from 'react-time-picker';
import ReactPlayer from 'react-player'

// function importAll(contextLoader) {
//   let videos = []
//   contextLoader.keys().map((id,index) => videos.push(contextLoader(id)) );
//   return videos
// }

// const contextLoader = require.context('./videos', true, /\.mp4/);
// const videoPaths = importAll(contextLoader);


function App() {
  const [treatStatus, setTreatStatus] = useState("waiting")
  const [pickle, setPickle] = useState({})
  const [selectedDate, handleDateChange] = useState(new Date());
  const [timeUser, setTimeUser] = useState('10:00');
  const [treatFrequency, setTreatFrequency] = useState('Today')
  const [scheduledDispenseTreats, setScheduledDispenseTreats] = useState([])
  const [videoPathsPickle,setVideoPathsPickle] = useState([])
  const [presignedAWSvideoURL, setPresignedAWSvideoURL] = useState([])
  const dispenseTreatURL = '/api/dispenseTreatRoute'
  const [dispenseTreatState, setDispenseTreatState] = useState([])


  useEffect(() => {
    setTreatStatus("waiting")
    // axios.get('/getPickle').then(
    //   res => {
    //     setPickle(res.data)
    //     setVideoPathsPickle(res.data['video']['videoPaths'])
    //     setScheduledDispenseTreats(res.data['scheduledDispenseTreats'])
    //   }
    // ).catch(err => console.log(err))
    // axios.get('/getPresignedURL').then(
    //   res => {
    //     setPresignedAWSvideoURL(res.data)
    //   }
    // ).catch(err => console.log(err))
  },[treatStatus])

  



  const handleTreatClick = () => {
    setTreatStatus("dispensing")
    fetch(dispenseTreatURL).then(response => {
      if(response.status == 200){
        return response.json()
      }
    }).then(data => setDispenseTreatState(data.taskId))
  }

  const setNewPickle = (newPickleAPI) => {
    // axios.post('/setPickle',newPickleAPI).then(
    //   res => {
    //     setPickle(res.data)
    //     setVideoPathsPickle(res.data['video']['videoPaths'])
    //     setScheduledDispenseTreats(res.data['scheduledDispenseTreats'])
    //   }
    // ).catch(err => console.log(err))
  }

  const handleDecrement = () => {
    const newPickle = {...pickle}
    if (newPickle["maxNumOfTreatsPerDay"] > 0){
      newPickle["maxNumOfTreatsPerDay"] -= 1
      setNewPickle(newPickle)
    }
    
    
  }
  const handleIncrement = () => {
    const newPickle = {...pickle}
    newPickle["maxNumOfTreatsPerDay"] += 1
    setNewPickle(newPickle)
  }
  const handleScheduleAdd = () => {
    const newPickle = {...pickle}
    const today = new Date()
    newPickle['scheduledDispenseTreats'].push({'time':timeUser,'freq':treatFrequency,'scheduledDate':[parseInt(today.getFullYear()),parseInt(today.getMonth()+1),parseInt(today.getDate())]})
    setNewPickle(newPickle)
  }
  const handleTreatFreqChange = (e) => {
    setTreatFrequency(e.value)
  }
    
  const handleRemoveTime = (e) => {

    const newPickle = {...pickle}
    newPickle['scheduledDispenseTreats'].splice(e.target.name,1)
    setNewPickle(newPickle)
  }
  // const handleRemoveTime = (e, {key}) => {
  //   const newPickle = {...pickle}
  //   newPickle['scheduledDispenseTreats'].splice(key,1)
  //   setNewPickle(newPickle)
  // }
  const handleResetTreatClick = (e) => {
    const newPickle = {...pickle}
    newPickle["treatsGivenToday"] = 0
    setNewPickle(newPickle)
  }
 
  const handleRemoveVideo = (e) => {
    const newVideoPaths = [...videoPathsPickle]
    newVideoPaths.splice(e.target.name,1)
    // axios.post('/removeVideo',{"index":e.target.name}).then(
    //   res => {
    //     setPickle(res.data)
    //     setVideoPathsPickle(res.data['video']['videoPaths'])
    //     // let contextLoader = require.context('./videos', true, /\.mp4/);
    //     // setVideoPaths(importAll(contextLoader));
    //     // console.log(res.data)
    //   }
    // ).catch(err => console.log(err))
  }

  return (
    <div className="App">
      <div class="container">
        <img src={tedi} alt="Tedi"/>
        { treatStatus=='dispensing' ?
          <h2>... Dispensing Treat ... Recording Video ..</h2>
          
        :
          <button class="big-treat-button" onClick={handleTreatClick}>Give Treat!</button>
        }
        
        <h1 class="max-treats-per-day">Max Treats Per Day</h1>
        <div class="max-treats-flexbox-container">
          <div class="max-treats-box-1">
            <button class="big-treat-button" onClick={handleDecrement}>-</button>
          </div>
          <div class="max-treats-box-2">
            <h1>{''+pickle["maxNumOfTreatsPerDay"]+''}</h1>
          </div>
          <div class="max-treats-box-1">
            <button class="big-treat-button" onClick={handleIncrement}>+</button>
          </div>
        </div>
        <h1 class="max-treats-per-day">Schedule a Treat</h1>
        <div class="schedule-flexbox-container">
          <div class="schedule-treat-box-1">
            <TimePicker
                onChange={setTimeUser}
                value={timeUser}
                inverted
              />
          </div>
          <div class="schedule-treat-box-2">          
            <Dropdown
              placeholder='Today'
              onChange={handleTreatFreqChange}
              options={[{key:'Today',text:'Today',value:"Today"},{key:'Tomorrow',text:'Tomorrow',value:"Tomorrow"},{key:'Everyday',text:'Everyday',value:"Everyday"}]}
            />
          </div>
          <div class="schedule-treat-box-3">
            <button class="schedule-button" onClick={handleScheduleAdd}>Schedule</button>
          </div>
        </div>
        <h1 class="scheduled-treats">Scheduled Treats</h1>
{/*         
        {typeof(pickle['scheduledDispenseTreats']) !== 'undefined' ? pickle['scheduledDispenseTreats'].length > 0 ?
        pickle['scheduledDispenseTreats'].map((itm, i) => (
          
          <div class="scheduled-flexbox-container">  
              <div class="scheduled-treat-box-1">
                <h2>{itm.freq} {itm.time}</h2> 
              </div>
              <div class="scheduled-treat-box-2">
                <button class="remove-button" onClick={handleRemoveTime} name={i}>Remove</button>
              </div>  
            </div>
        ))
      :'':''} */}
        {/* {typeof(pickle['scheduledDispenseTreats']) !== 'undefined' ? pickle['scheduledDispenseTreats'].length > 0 ?
          pickle['scheduledDispenseTreats'].map((itm, i) => (
            <div class="scheduled-flexbox-container">  
              <div class="scheduled-treat-box-1">
                <h2>{itm.freq} {itm.time}</h2> 
              </div>
              <div class="scheduled-treat-box-2">
                <button class="remove-button" onClick={handleRemoveTime} key={i}>Remove</button>
              </div>  
            </div>
          ))
        :'':''} */}
        
          {scheduledDispenseTreats.map((itm, index) => (
            <div>
            <div class="scheduled-flexbox-container">
              <div class="scheduled-treat-box-1">
                <h2>{itm.freq} {itm.time}</h2>
              </div>
              <div class="scheduled-treat-box-2">
                <button class="remove-button" onClick={handleRemoveTime} name={index}>Remove</button>
              </div> 
            </div>
            </div>
          ))}
        
          <div>
            <button class="remove-button" onClick={handleResetTreatClick}>Reset Treats Today</button>
          </div>
          { typeof(presignedAWSvideoURL) !== 'undefined'  ? presignedAWSvideoURL.length > 0 ?
          <div class="playerWrapper">
              <ReactPlayer
                //className='react-player fixed-bottom'
                url={presignedAWSvideoURL[0]}
                width='100%'
                height='100%'
                controls='true'
              />
            </div>
            : '' :'' }
          {/* { typeof(presignedAWSvideoURL) !== 'undefined'  ? presignedAWSvideoURL.length > 0 ?
            presignedAWSvideoURL.map((itm,index) => (
            <div>
            <div class="playerWrapper">
              <ReactPlayer
                //className='react-player fixed-bottom'
                url={itm}
                width='100%'
                height='100%'
                controls='true'
              />
            </div>
            <div class="remove-video-button-box">
              <button class="remove-button" onClick={handleRemoveVideo} name={index}>Delete Video</button>
            </div> 
            </div>
            ))
          
          : '' : ''} */}
{/* 
          <div class="playerWrapper">
              <ReactPlayer
                //className='react-player fixed-bottom'
                url={'/var/www/piApp/react-frontend/src/videos/Tedi3.mp4'}
                width='100%'
                height='100%'
                controls='true'
              />
            </div>
           */}
          
          
      </div>

    </div>
  );
}

export default App;
