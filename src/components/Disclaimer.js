import React from "react";

const Disclaimer = (props) => {

    return(
        <div className="disclaimer">
          <p>
           <small>
           {props.translate('Tutti i prezzi sono da intendersi in Euro, IVA esclusa.')}&nbsp;
           {props.translate('Se disponi di coupon o sconti riservati accedi per verificare il prezzo finale!')}
           &nbsp;
          {props.translate('Quotazioni dettagliate e profilazioni ancora più specifiche (es. natura giuridica, province, classi di fatturato, numero dipendenti, etc.) si possono ottenere richiedendo un preventivo personalizzato e gratuito.')} 
          </small>
          </p>
        </div>
    );
}


export default Disclaimer;