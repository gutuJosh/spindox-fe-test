import React, {useState} from "react";
import useFetch from "./hooks/useFetch";
import Preloader from "./components/Preloader";
import './App.css';

function App() {

  const API_URL = 'https://randomuser.me/api';
  const {data} = useFetch(API_URL);



  return (
    <div className="App">
      {data === false ?
      <Preloader label="Loading..."/>
      :
      <p>OK</p>
      }
    </div>
  );
}

export default App;
