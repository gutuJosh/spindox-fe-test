import React from "react";
import PropTypes from 'prop-types';



const LoadResults =  React.forwardRef((props, ref) => {


    return(
        <div id="reload">
        <button ref={ref} onClick={(e) => {
          e.preventDefault();
          props.load();
        }}>{props.translate("Carica più risultati")}</button>
     </div>
    );
});

LoadResults.protoTypes = {
   load: PropTypes.func.isRequired
}

export default LoadResults;