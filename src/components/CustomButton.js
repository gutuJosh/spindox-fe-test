import React from "react";
import PropTypes from 'prop-types';

const CustomButton = (props) => {

    return(
        <div className={props.active === props.value ? 'custon-button active' : 'custom-button'} onClick={() => {
            props.handleClick(props.label, props.value);
        }}>   
          <i className={props.icon} title={props.label}></i>
        </div>
    );
}

CustomButton.protoTypes = {
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    handleClick : PropTypes.func.isRequired
}

export default CustomButton;