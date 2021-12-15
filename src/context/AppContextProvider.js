import React, { useReducer, createContext } from "react";

export const AppContext = createContext();

const initialState = {
    lists: [],
};


const reducer = (state, action) => {
    switch(action.type){
        case "ADD_LIST":
        return {
            lists: [...state.lists, action.payload]
        };
        case "REMOVE_LIST":
        return {
            lists: state.lists.filter(item => item.pi !== action.payload)
        };
        case "UPDATE_LIST":
        return {
            lists: state.lists.map( item => {
                if(item.pi === action.payload.id){
                    item.updates = action.payload.status;
                }
                return item;
            })
        };
        default:
        throw new Error();
    }
}

export const AppContextProvider = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);
  
    return (
      <AppContext.Provider value={[state, dispatch]}>
        {props.children}
      </AppContext.Provider>
    )
  }