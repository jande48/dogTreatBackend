import './App.css';
import React, {useState, useEffect} from 'react';

function App() {
  const [initialState, setState] = useState([])
  const [idOfTask, setIdOfTask] = useState('')
  const url = '/api'
  const dispenseTreatURL = '/dispenseTreatRoute'
  const [dispenseTreatState, setDispenseTreatState] = useState([])

  useEffect(()=> {
    fetch(url).then(response => {
      if(response.status == 200){
        return response.json()
      }
    }).then(data => setState(data.channel))
  }, [])
  
  console.log(idOfTask)

  const handleDispenseTreat = (e,value) => {
    fetch(dispenseTreatURL).then(response => {
      if(response.status == 200){
        return response.json()
      }
    }).then(data => setDispenseTreatState(data.taskId))
  }
  console.log(dispenseTreatState)
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <h1>it worked</h1>
        <p>
          This is the state.
          {initialState}
        </p>
      </header>
      <body>
        <button onClick={handleDispenseTreat}>Dispense dispenseTreatRoute</button>
      </body>
    </div>
  );
}

export default App;
