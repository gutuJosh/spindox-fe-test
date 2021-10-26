import React, { useState, useEffect } from "react";
import useFetch from "./hooks/useFetch";
import useWorker from "./hooks/useWorker";
import Preloader from "./components/Preloader";
import ProfileImage from "./components/ProfileImage";
import CustomButton from "./components/CustomButton";
import Textarea from "./components/Textarea";
import './App.css';
import Worker from "./Worker";


function App() {

  const API_URL = 'https://randomuser.me/api';
  //use custom hook to get data
  const {data} = useFetch(API_URL);
  const {list} = useWorker(Worker);
  //use state to manage text and css active section
  const [sectionLabel, setSectionLabel] = useState('');
  const [sectionText, setSectionText] = useState('');
  const [isActive, setActiveSection] = useState(false);

  //handle app state
  const handleUserInfo = function(label, value){
     setSectionLabel(label);
     setSectionText(value);
     setActiveSection(value);
  }

  const formatDate = function(datestamp){
    const d = new Date(datestamp);
    const month = (d.getMonth() + 1) < 10 ? `0${(d.getMonth() + 1)}` : (d.getMonth() + 1);
    const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
    const value =  `${day}/${month}/${d.getFullYear()}`;
    return value;
  }


  useEffect(() => {
    if(data && sectionText === ''){
      handleUserInfo("My name is", `${data.results[0].name.first} ${data.results[0].name.last}`);
     
    }
    if(list){
      console.log(list);
    }
  });


  return (
  
    <div className="App">
      {data === false ?
      <Preloader label="Loading..."/>
      :
      <div className="app-body">
        <ProfileImage url={data.results[0].picture.large}/>
        <div className="textarea">
         <Textarea label={sectionLabel} text={sectionText}/>
        </div>
        <nav>
         <CustomButton 
          icon="fas fa-user" 
          label="My name is" 
          value={`${data.results[0].name.first} ${data.results[0].name.last}`} 
          handleClick={handleUserInfo} 
          active={isActive}
          />
         <CustomButton 
          icon="far fa-envelope" 
          value={`${data.results[0].email}`} 
          label="My email is"  
          handleClick={handleUserInfo} 
          active={isActive}
         />
         <CustomButton 
          icon="far fa-calendar-alt" 
          value={formatDate(data.results[0].dob.date)} 
          label="My birthday is" 
          handleClick={handleUserInfo} 
          active={isActive}
         />
         <CustomButton 
          icon="fas fa-map-marked-alt" 
          value={`${data.results[0].location.street.number} ${data.results[0].location.street.name} - ${data.results[0].location.city}, ${data.results[0].location.country}`} 
          label="My address is" 
          handleClick={handleUserInfo}
          active={isActive}
         />
         <CustomButton 
          icon="fas fa-phone" 
          value={`${data.results[0].phone} / ${data.results[0].cell}`} 
          label="My phone is" 
          handleClick={handleUserInfo} active={isActive}
          />
         <CustomButton 
          icon="fas fa-lock" 
          value={`${data.results[0].login.password}`} 
          label="My password is" 
          handleClick={handleUserInfo} 
          active={isActive}
         />
        </nav>
      </div>

      }
    </div>
  );
}

export default App;
