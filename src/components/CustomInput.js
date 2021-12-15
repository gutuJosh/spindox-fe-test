import React, { useState, useContext, useRef } from "react";
import { SearchContext } from "../context/SearchContextProvider";
import "../config/i18n.js";
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';


const CustomInput = (props) => {
    const { t } = useTranslation();
    //use custom hook to get data
    //get selector options
    const [options, setOptions] = useState(props.options);
    //set a semaphore to manage options filtering
    const [filterData, setFilterData] = useState(false);
    //use state to manage user selected value
    const [value, setValue] = useState(props.selectedOption !== false ? props.selectedOption : '');
    const [subOptionValue, setSubOptionValue] = useState(props.selectedSubOption !== false ? `, ${props.selectedSubOption}` : '');

    const [state, dispatch] = useContext(SearchContext);

    //use state to manage suggestion
    const [suggestion, setSuggetion] = useState('');
    //use state to open/close sggesstion tab
    const [toggle, setToggle] = useState(false);
    //use ref to manage input[type="text"] fields
    const selectFiled = useRef(null);
    const searchFiled = useRef(null);
    let counter = 0;



  
    
   if(options !== props.options && filterData === false){//update options only if we are not filtering the current options
      setOptions(props.options);
   }
    
  
    const filterOptions = (txt) => {
        if(!filterData){
          setFilterData(true);
        }
        const filteredOptions = props.options.filter( (item) => {
          let parameter = props.name === 'nations' ? item.name.toLowerCase() : item.toLowerCase();
          let expression = txt.length <= 5 ? `^${txt.toLowerCase()}` : `${txt.toLowerCase()}`;
          if(parameter.match(new RegExp(expression, 'i'))){
              return item;
          }
        });
        
        setOptions(filteredOptions);
    }

    const closeSuggestionsTab = () => {
       try{
         document.querySelectorAll(`input[name="${props.name}"]:checked`)[0].checked = false;
       }
       catch(e){
         //
       }
       setToggle(false)
       setFilterData(false);
       setSuggetion('');
       searchFiled.current.blur();
    }

    const remove = () => {
      props.handleSelect(false, false);
      setValue('');
      setSubOptionValue('');
      setFilterData(false);
      try{
        document.querySelectorAll(`input[name="${props.name}"]:checked`)[0].checked = false;
      }
      catch(e){
        //
      }
    }

    const handleChange = (target, nationName) => {

      const inputNations =  document.querySelectorAll('input[name="nations"]');
      const inputRegions = document.querySelectorAll('input[name="regions"]');
      const inputCategories = document.querySelectorAll('input[name="categories"]');
      const optionsList = document.querySelectorAll(`input[name="${props.name}"]`);

      if(target.checked === true){
        
        setToggle(true);
        props.handleSelect(target.value, false);
        
        optionsList.forEach( item => { //deselect all other options
          if(item.id !== target.id){
              item.checked = false;
          }
        });

        inputRegions.forEach( item => item.checked = false);

        if(props.name === 'nations'){
            inputCategories.forEach( item => item.checked = false);
            setValue(nationName);
            setSearchParameters('UPDATE_NATION',  {'name': nationName, 'iso' : target.value});
        }
        else{
          setValue(target.value);
          inputNations.forEach( item => item.checked = false);
          closeSuggestionsTab();
          setSearchParameters('UPDATE_CATEGORY', target.value);
        }

      }
      else{
        remove();
        inputRegions.forEach( item => {
          if(item.dataset.id === target.id){
            item.checked = false;
          }
        });
        
        if(props.name === 'nations'){
          setSearchParameters('UPDATE_NATION',  {'name': false, 'iso' : false});
          setSearchParameters('UPDATE_REGION', false);
        }
        else{
          setSearchParameters('UPDATE_CATEGORY', false);
        }
       
      }
    }

    const handleRegions = (target, nation) => {
      if(target.checked === true){

        const inputCategories = document.querySelectorAll('input[name="categories"]');
        const regions = document.querySelectorAll('input[name="regions"]');
        const optionsList = document.querySelectorAll(`input[name="${props.name}"]`);

        setSubOptionValue(`, ${target.value}`);
        setSearchParameters('UPDATE_REGION', target.value);
        setTimeout(() => props.handleSelect(nation, target.value), 1000);

        regions.forEach( item => {
           if(item.id !== target.id){
              item.checked = false;
           }
        });
        inputCategories.forEach( item => item.checked = false);
        optionsList.forEach( item => {
          
          if(item.id === target.dataset.id){
              item.cheked = true;
              document.querySelector(`#${item.id}`).checked = true;
              setValue(item.dataset.value);
          }
          else{
            item.checked = false;
          }
        });
      }
      else{ 
        props.handleSelect(nation, false);
        setSubOptionValue('');
        setSearchParameters('UPDATE_REGION', false);
      }
    }

    const setSearchParameters = (actionName, value) => {
      dispatch({
        type: actionName,
        payload: value
      })
    }


    return(
        <div onMouseLeave={() => closeSuggestionsTab()} className="select-container">   
          <input 
           ref={selectFiled}
           type="text" 
           value={value+subOptionValue} 
           id={props.name}
           placeholder={props.placeholder}
           onFocus={() => {
             setToggle(true);
             selectFiled.current.blur();
             searchFiled.current.focus();
           }}
           onChange={() => false}
          />
          <div className="selector-ctrl-btns">
            {value && 
            <a href="/" onClick={(e) => {
              e.preventDefault();
              if(props.name === 'nations'){
                setSearchParameters('UPDATE_NATION',  {'name': false, 'iso' : false});
                setSearchParameters('UPDATE_REGION', false);
              }
              else{
                setSearchParameters('UPDATE_CATEGORY', false);
              }
             
              remove();
            }}>
               <svg className="icn small">
                <use href="#close-icon"></use> 
               </svg>
            </a>
            }
            <a href="/" onClick={(e) => {
              e.preventDefault();
              searchFiled.current.focus();
              return !toggle ? setToggle(true) : closeSuggestionsTab();
            }}>
               {!toggle ? 
               <svg className="icn small" title={t("Apri")}>
                <use href="#arrow-down-icon"></use> 
               </svg>
               :
               <svg className="icn small" title={t("Chiudi")}>
                <use href="#arrow-up-icon"></use> 
               </svg>
               }
            </a>
          </div>
          <div className={toggle ? 'suggesstions open' : 'suggesstions closed'}>
            <input
             ref={searchFiled}
             name="search"
             type="text"
             value={suggestion}
             onChange={(e) => {
              const val = e.target.value;
              setSuggetion(val);
              filterOptions(val);
             }} 
             onFocus={() => {
               setToggle(true);
               try{
                document.querySelectorAll(`input[name="${props.name}"]:checked`)[0].checked = false;
                }
                catch(e){
                  //
                }
               setTimeout( () => setFilterData(filterData ? false : true), 300);
              
             }}
             onBlur = {(e) => {
              setSuggetion('');
            }}
             placeholder={t("Cerca...")}
            />
            <ul>
               {options.map( (item, i) => {
                 counter++;
                 return(
                 <li key={i}>
                   <input 
                    type="checkbox" 
                    defaultChecked={false}
                    name={props.name} 
                    id={`${props.name}-${counter}`} 
                    data-value={props.name === 'nations' ? item.name.toLowerCase() : item.toLowerCase()} 
                    value={props.name === 'nations' ? item.iso : item} 
                    onChange={(e) => handleChange(e.target, item.name)}
                 />
                 {props.name === 'nations' ?
                  <label htmlFor={`${props.name}-${counter}`}>
                   <span className={`flag-${item.iso.toLowerCase()}`}></span>
                   {item.name}
                  </label>
                   :
                   <label htmlFor={`${props.name}-${counter}`}>
                      {item}
                   </label>
                 }
                   {props.name === 'nations' &&
                    <ul className="options">
                       {item.regions.map( (region, index) => (
                         <li key={index} onClick={() =>  props.handleSelect(item.iso, region)}>
                           <input 
                            type="checkbox" 
                            name="regions" 
                            id={region.replace(/ /g, '_').toLowerCase()} 
                            value={region} 
                            data-id={`${props.name}-${counter}`} 
                            onChange={(e) => handleRegions(e.target, item.iso)}
                            />
                            <label htmlFor={region.replace(/ /g, '_').toLowerCase()}>
                               {region}
                            </label>
                        </li>
                       ))}
                    </ul>
                   }
                 </li>  
               )})
              }
            </ul>
          </div>
        </div>
    );
}

CustomInput.protoTypes = {
    name: PropTypes.string.isRequired, 
    options: PropTypes.array.isRequired,
    handleSelect : PropTypes.func.isRequired
}

export default CustomInput;