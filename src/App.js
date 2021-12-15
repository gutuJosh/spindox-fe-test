import React, { useState, useEffect, Suspense } from "react";
import Preloader from "./components/Preloader";
import { AppContextProvider } from "./context/AppContextProvider";
import { SearchContextProvider } from "./context/SearchContextProvider";
import { getLanguage } from "./hooks/helpers";
import i18Languages from "./config/i18Languages";
import i18n from "./config/i18n";
import Header from "./components/Header";
import './App.css';
import "./config/i18n.js";
import { useTranslation } from "react-i18next";

const App =  () => {
  const { t } = useTranslation();
  const [list, setList] =  useState([]);

  //use state to manage views
   const [page, setPage] = useState('search');
 
  
  //load views
  const Search = React.lazy(() => import(`./views/Search.js`));
  const MyLists = React.lazy(() => import(`./views/MyLists.js`));

  const toggleView = (view) => setPage(view);



  useEffect( () => { 
      if(list.length === 0){
        //https://www.bancomail.it/listino-email-completo/geo-json
        async function fetchData(){
         try{
          const lng = await getLanguage();
          const language =  i18Languages.indexOf(lng) !== -1 ? lng : 'en';
          i18n.changeLanguage(language);
          const response = await fetch(`https://www.bancolab.com/${language}/email-directory/geo-json/v/1/ext/1`);
          const userData = await response.json();
          setList(userData.data);
         }
         catch(e){
           console.log(e.message);
         }
        }
        fetchData();
      } 
      
  }, [list, setList]);
  


  return (
  
    <div className="App">
      {list === undefined ?
      <Preloader label={t("In caricamento...")}/>
      :
      <div className="app-body">
      <AppContextProvider>
       <Header setPage={toggleView} translate={t} />
       <Suspense fallback={<Preloader label={t("Componente in caricamento...")}/>}>
        <SearchContextProvider>
         {page === 'search' ? 
         <Search data={list}/>
         :
         <MyLists/>
        }
        </SearchContextProvider>
       </Suspense>
      </AppContextProvider>
       
      </div>
      }
    </div>
  );
}

export default App;
