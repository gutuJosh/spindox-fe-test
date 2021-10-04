import React, {useState, useEffect} from "react";
import useFetch from "./hooks/useFetch";
import './App.css';

function App() {

  const API_URL = 'https://randomuser.me/api';
  const {data} = useFetch(API_URL);

  useEffect( () => {  
     console.log(data);
  });

  return (
    <div className="App">
      
    </div>
  );
}

export default App;
