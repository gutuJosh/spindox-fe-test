/*global chrome*/
import React, { useContext, useEffect } from "react";
import Disclaimer from "../components/Disclaimer";
import { AppContext } from "../context/AppContextProvider";
import { getFinalPrice } from "../hooks/helpers.js";
import "../config/i18n.js";
import i18n from "../config/i18n";
import { useTranslation } from "react-i18next";

export default function MyLists(props) {

    const { t } = useTranslation();

    const [state, dispatch] = useContext(AppContext);
    
    const domain = i18n.language === 'it' ? `https:www.bancomail.it` : `https:www.bancomail.com/${i18n.language}`;
  
    const removeList = (id) => {

        dispatch({
            type: "REMOVE_LIST",
            payload: id
        })

        const getLists = state.lists.filter(item => item.pi !== id);
        try{
          chrome.storage.local.set({'bm_my_lists': JSON.stringify(getLists)}, function() {
              return;
          });
        }
        catch(e){
         console.log(e.message + ' ...update local storage');
         localStorage.setItem("bm_my_lists", JSON.stringify(getLists));
        }
    }

    const toggleSync = (id, status, discount) => {

      if(discount !== '' && discount >= 50 && status === true){
        alert(t('La lista ha raggiunto il limite massimo di sconto!'));
        return;
      }

      dispatch({
        type: "UPDATE_LIST",
        payload: {'id' : id, 'status' : status}
      });

      try{
        chrome.storage.local.set({'bm_my_lists': JSON.stringify(state.lists)}, function() {
            return;
        });
      }
      catch(e){
       console.log(e.message + ' ...update local storage');
       localStorage.setItem("bm_my_lists", JSON.stringify(state.lists));
      }

    }

    const buySingleItem = (id) => `${domain}/${t('liste-email')}/${t('carrello')}?packs=${id}`;

    const buyAll = () => {
       const ids = [];
       state.lists.forEach((item) => ids.push(item.pi));
       return `${domain}/${t('liste-email')}/${t('carrello')}?packs=${ids.join(',')}`;
    }

    useEffect(() => {
       try{ //delete all previous badge
         chrome.browserAction.setBadgeText({});
       }
       catch(e){
         console.log(e.message);
       }
    },[]);


    return(
       <React.Fragment>
           <div className="listContainer">
            <ul className="lists">
             {state.lists.map( (item, i) => (
                 <li key={i} className="flex flex-middle">
                 <div>
                   <p><strong>{item.pn}</strong></p>
                   <p><span className={`flag-${item.iso.toLowerCase()}`}></span>{item.n} - {t(item.re)}</p>
                   <p>{t("Anagrafiche")}: {item.i}</p>
                 </div>
                 <div className="list-price-holder">
                   <span className={item.d !== '' ? 'linetrough' : ''}>
                     {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(item.p)}
                   </span>
                   {item.d !== '' &&
                    <span>{getFinalPrice(item.d, item.p)}</span>
                   }
                 </div>
                 <div className="sync-icon-holder tooltip">
                  {typeof(item.updatesInfo) === 'undefined' ?  
                  <React.Fragment>
                  {item.updates === false ? 
                    <svg className="icn" onClick={() => toggleSync(item.pi, true, item.d)}>
                      <use href="#no-sync-icon"></use>
                    </svg>
                    :
                    <svg className="icn spinner" onClick={() => toggleSync(item.pi, false, item.d)}>
                      <use href="#sync-icon"></use>
                    </svg>
                  }
                  <span className="tooltiptext">{item.updates === false ? t("Avviare il monitoraggio") : t("Ferma il monitoraggio")}</span>
                  </React.Fragment>
                  :
                  <React.Fragment>
                   <svg className="icn shakeItbabe">
                    <use href="#bell-icon"></use>
                   </svg>
                   <span className="tooltiptext big">
                     {t("Sconto")} : {item.updatesInfo.discount}%
                     <br/>
                     {t("Prezzo finale")}: {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(item.p)}
                   </span>
                  </React.Fragment>
                 }
                </div>
                <div>
                 <div className="tooltip">
                  <svg className="icn" onClick={() => removeList(item.pi)} title={t("Rimuovi")}>
                    <use href="#trash-icon"></use>
                  </svg>
                  <span className="tooltiptext">{t("Rimuovi")}</span>
                 </div>
                 <a href={buySingleItem(item.pi)} className="btn" target="_blank" rel="noreferrer">{t("Acquista")}</a>
                </div>  
              </li>
             ))}  
           </ul>
           {state.lists.length > 0 &&
            <Disclaimer translate={t} />
           }
           {state.lists.length > 1 &&
           <a className="btn" title={t("Acquista su Bancomail")} target="_blank" href={buyAll()} rel="noreferrer">{t("Acquista tutte le liste")}</a>
           }
           {state.lists.length === 0 &&
           <p className="prompt-msg"><strong>{t("Non hai salvato nessuna lista!")}</strong></p>
           }
          </div>
       </React.Fragment>
    );
}