import React from "react";
import PropTypes from 'prop-types';

const Preloader = (props) => {

    return(
        <div className="preloader">
         <div className="header">
          <p>
          <svg className="icn spinner">
            <use href="#spinner-icon"></use>
           </svg>
          </p>
          <p>{props.label}</p>
         </div>
         
        </div>
    );
}

Preloader.protoTypes = {
    label: PropTypes.string.isRequired
}

export default Preloader;