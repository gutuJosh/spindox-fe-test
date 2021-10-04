import React, {useState, useEffect} from "react";
import useFetch from "./hooks/useFetch";
import './App.css';

function App() {

  const API_URL = 'https://randomuser.me/api';
  const {data} = useFetch(API_URL);

  useEffect( () => {  
     
  });

  return (
    <div className="App">
      {data === false ?
      <p>Loading...</p>
      :
      <p>OK</p>
      }
    </div>
  );
}

export default App;
