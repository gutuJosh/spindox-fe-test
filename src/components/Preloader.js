import React from "react";
import PropTypes from 'prop-types';

const Preloader = (props) => {

    return(
        <div className="preloader">
         <div className="header">
          <p><i className="fas fa-spinner fa-spin"></i></p>
          <p>{props.label}</p>
         </div>
         
        </div>
    );
}

Preloader.protoTypes = {
    label: PropTypes.string.isRequired
}

export default Preloader;