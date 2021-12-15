import React, { useState, useEffect, useContext, useRef } from "react";
import CustomInput from "../components/CustomInput";
import ListItems from "../components/ListItems";
import LoadResults from "../components/LoadResults";
import { SearchContext } from "../context/SearchContextProvider";
import "../config/i18n.js";
import { useTranslation } from "react-i18next";


const getNationsAndCategories = function (data) {
    const categories = [];
    let nations = [];
    data.forEach( (item) => {
      if(!categories.includes(item.pn) && item.pn !== 'Tutte'){
         categories.push(item.pn);
      }
      let tags = item.t !== '' ? item.t.split(',') : [];
      tags.forEach(element => {
        let formatTag = element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
        if(!categories.includes(formatTag) && formatTag !== ''){
          categories.push(formatTag);
        }
      });
      let iso = item.iso;
      if(!nations.hasOwnProperty(iso) && item.n !== 'Tutte'){
          nations[iso] = {
            'name' : item.n,
            'regions' : (item.re !== 'Tutte le regioni') ? [item.re] : []
          };
      }
      else if(nations.hasOwnProperty(iso) && !nations[iso].regions.includes(item.re)){
         if((item.re !== 'Tutte le regioni')){
             nations[iso].regions.push(item.re);
         }
      }
    }); 
    
    const nationsToArray = [];
    for(let key in nations){
      nationsToArray.push(
            {
              'iso' : key,
              'name' : nations[key].name,
              'regions' : nations[key].regions   
            }
        )
    }
    nations = nationsToArray;
    categories.sort();
    nations.sort(function (a, b) {
      return a.name.localeCompare(b.name); 
    });
    return {categories, nations}
}

let searchResults = [];
const perPage = 10;


export default function Search(props) {
    const { t } = useTranslation();
    //useMemo to extract all available nations and categories and avoid expensive calculations on every render
    const getInitialProps = React.useMemo(() => getNationsAndCategories(props.data), [props.data]);
    //use state to capture user input
    const [selectedNation, selectNation] = useState(false);
    const [selectedRegion, selectRegion] = useState(false);
    const [selectedCategory, selectCategory] = useState(false);
    //use state to manage nations and categories based on user input
    const [nations, setNations] = useState(getInitialProps.nations);
    const [categories, setCategories] = useState(getInitialProps.categories);
    //use state to manage pagination and results
    const [currentPage, setPage] = useState(1);
    const [results, setResults] = useState([]);

    const [ state ] = useContext(SearchContext);

    //set a ref to resultsContainer and LoadResults component
    const scrollArea = useRef(null);
    const loadMoreResultsBtn = useRef(null);

  
    
    const updateCategories = (nation, region) => {
        //update available categories selector when user select a nation or a region
      if( nation === false ){
        setCategories(getInitialProps.categories);
        selectNation(false);
        selectRegion(false);
        if(selectedCategory === false){
          searchResults = [];
          setPage(1);
          setResults(searchResults);
        }
        else{
         searchResults = handleSearch(selectedCategory, false, false);
         setPage(1);
         setResults( getResults(searchResults, 1) );
        }
        return;
      }

      //set empty array to store later the available categories
      const categories = [];
      //update state
      selectNation(nation);
      selectRegion(region);
      
      props.data.forEach((item) => {
        if (!categories.includes(item.pn) && item.pn !== 'Tutte' && item.iso === nation) {
          if (region !== false) {
            if (item.re === region && item.pn !== 'Tutte') {
              categories.push(item.pn);//store the category
            }
          }
          else {
            if (region !== false) {
              if (item.re === region && item.pn !== 'Tutte') {
                   categories.push(item.pn);//store the category
              }
            }
            else{
             categories.push(item.pn);//store the category
            }
          }
        }
      });
      
      categories.sort();//order alphabetically
      setCategories(categories); //update state
    }

    const handleCategories = (nation, region) => {

      updateCategories(nation, region);
      searchResults = handleSearch(selectedCategory, nation, region); //get the results
      setResults( getResults(searchResults, 1) ); //update state with th efirst set of results
      
      setPage(1); //set current page
      scrollArea.current.scrollTop = 0; //set resultsContainer scroll bar to the begining 

    }


    const updateNations = (category) => {
            //update available nations and regions selector when user select a category
            if( category === false ){
              setNations(getInitialProps.nations);
              selectCategory(false);
              if(selectedNation === false){
                searchResults = [];
                setPage(1);
                setResults(searchResults);
              }
              else{
               searchResults = handleSearch(false, selectedNation, selectedRegion);
               setPage(1);
               setResults( getResults(searchResults, 1) );
              }
              return;
          }
       
    
          const countries = [];
          selectCategory(category);
          props.data.forEach((item) => {
              let iso = item.iso;
              if(!countries.hasOwnProperty(iso) && item.n !== 'Tutte' && (item.pn === category || item.t.toLowerCase().indexOf(category.toLowerCase()) !== -1)){
                countries[iso] = {
                  'name' : item.n,
                  'regions' : (item.re !== 'Tutte le regioni') ? [item.re] : []
                };
             }
             else if(countries.hasOwnProperty(iso) && !countries[iso].regions.includes(item.re) && (item.pn === category || item.t.toLowerCase().indexOf(category.toLowerCase()) !== -1)){
                if((item.re !== 'Tutte le regioni')){
                  countries[iso].regions.push(item.re);
                }
             }
          });
    
          const nationsToArray = [];
          for(let key in countries){
            nationsToArray.push(
                  {
                    'iso' : key,
                    'name' : countries[key].name,
                    'regions' : countries[key].regions   
                  }
              )
          }
          nationsToArray.sort(function (a, b) {
            return a.name.localeCompare(b.name);
          });
          
          setNations(nationsToArray);
    }

    const handleNations = (category) => {
      updateNations(category);
      searchResults = handleSearch(category, selectedNation, selectedRegion);
      setResults( getResults(searchResults, 1) );
      setPage(1);
      scrollArea.current.scrollTop = 0;
    }

    const getResults = (res, position) => res.slice( ((perPage * position) - perPage), (perPage * position) );


    const handleSearch = (category, nations, region) => {
        const applyCategoryFilter = category !== false ?  props.data.filter( item => (item.pn === category || item.t.toLowerCase().indexOf(category.toLowerCase()) !== -1)) : props.data;
        const applyNationFilter   = nations !== false ?  applyCategoryFilter.filter( item => item.iso === nations) : applyCategoryFilter;
        const applyRegionFilter   = region !== false ? applyNationFilter.filter( item => item.re === region) : applyNationFilter;
        return applyRegionFilter;
        
    };
    
    const loadMoreResults = () => {
      let rez = results;
      setResults(rez.concat(getResults(searchResults, (currentPage + 1))));
      setPage(currentPage + 1);
    }

    useEffect(() => {
       
      if(state.searchParameters.category !== false || state.searchParameters.nation.iso !== false || state.searchParameters.region !== false){
         if(state.searchParameters.category !== false){
           updateNations(state.searchParameters.category);
         }
         else{
          updateNations(false);
         } 
         if(state.searchParameters.nation.iso){
          updateCategories(state.searchParameters.nation.iso, state.searchParameters.region);
         }
         else{
          updateCategories(false, false);
         } 
         searchResults = handleSearch(state.searchParameters.category, state.searchParameters.nation.iso, state.searchParameters.region);
         setResults( getResults(searchResults, 1) );
         setPage(1);
      }

    },[]);

  

    return(
       <React.Fragment>
           <div id="searchContainer">
            <div className="flex wrapper">
             <div className="flex-item"> 
              <CustomInput 
               options={categories} 
               handleSelect={handleNations} 
               name="categories" 
               placeholder={t("Seleziona la categoria")}
               selectedOption={state.searchParameters.category}
               selectedSubOption = {false}
               />
             </div>
             <div className="flex-item">
              <CustomInput 
               options={nations} 
               handleSelect={handleCategories} 
               name="nations" 
               placeholder={t("Seleziona la nazione")}
               selectedOption={state.searchParameters.nation.name}
               selectedSubOption={state.searchParameters.region}
               />
             </div>
            </div>
           </div>
           <div className="" id="resultsContainer" ref={scrollArea}>

            {results.length > 0 ?
                <ListItems data={results} ref={{scrollRef: scrollArea, btnRef: loadMoreResultsBtn}} translate={t}/>
            :
            <p className="prompt-msg"><strong>{t("Seleziona una categoria e/o una nazione!")}</strong></p>
            }
              
            {(results.length > 0 && (currentPage + 1) <= Math.ceil(searchResults.length / 10)) && 
              <LoadResults load={loadMoreResults}  ref={loadMoreResultsBtn} translate={t}/>
            }

          </div>
       </React.Fragment>
    );
}