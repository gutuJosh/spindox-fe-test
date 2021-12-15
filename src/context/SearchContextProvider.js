import React, { useReducer, createContext } from "react";

export const SearchContext = createContext();

const initialState = {
    searchParameters:{
        'category': false,
        'nation': {'name': false, 'iso' : false},
        'region': false
    }
};


const reducer = (state, action) => {
    switch(action.type){
        case "UPDATE_CATEGORY":
            return { 
                searchParameters: {
                    'category' : action.payload,
                    'nation' : state.searchParameters.nation,
                    'region' : state.searchParameters.region 
                }
        }
        case "UPDATE_NATION":
            return { 
                searchParameters: {
                    'category' : state.searchParameters.category,
                    'nation' : action.payload,
                    'region' : state.searchParameters.region 
                }
        }
        case "UPDATE_REGION":
            return { 
                searchParameters: {
                    'category' : state.searchParameters.category,
                    'nation' : state.searchParameters.nation,
                    'region' : action.payload 
                }
        }
        case "RESET":
            return { 
                searchParameters: {
                    'category' : action.payload,
                    'nation' : action.payload,
                    'region' : action.payload 
                }
        }
        default:
        throw new Error();
    }
}

export const SearchContextProvider = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);
  
    return (
      <SearchContext.Provider value={[state, dispatch]}>
        {props.children}
      </SearchContext.Provider>
    )
  }