import React, { useState, useEffect } from "react";
import Preloader from "./components/Preloader";
import useWorker from "./hooks/useWorker";
import Worker from "./Worker";
import './App.css';

function App() {

  //use custom hook to get data
  const {list} = useWorker(Worker);
  //use state to manage search input options and suggestions
  const [nations, setNations] = useState([]);
  const [categories, setCategories] = useState([]);




  useEffect(() => {

    if(list){
      const getCategories = [];
      const getNations = [];
      list.forEach( (item) => {
        if(!getCategories.includes(item.pn) && !item.pn.includes('Tutte')){
          getCategories.push(item.pn);
        }
        if(!getNations.includes(item.n) && !item.n.includes('Tutte')){
          getNations.push({
            'name' : item.n,
            'iso' : item.iso.toLowerCase(),
          });
        }
      }
    }

  });


  return (
  
    <div className="App">
      {list === false ?
      <Preloader label="Loading..."/>
      :
      <div className="app-body">
        
      </div>
      }
    </div>
  );
}

export default App;
