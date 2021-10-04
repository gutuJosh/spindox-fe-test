import React from "react";
import PropTypes from 'prop-types';

const Textarea = (props) => {

    return(
        <div className="custom-button">   
         <h2>{props.label}</h2>
         <h1>{props.text}</h1>
        </div>
    );
}

Textarea.protoTypes = {
    label: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
    
}

export default Textarea;