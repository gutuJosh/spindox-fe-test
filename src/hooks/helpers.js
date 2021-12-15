/*global chrome*/

export const getFinalPrice = (discount, price) => {
    const getValue = (price * discount) / 100;
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format((price - getValue));
}


export const getLanguage = () => {

  const getInfo = () => new Promise( (resolve, reject) => {
      try{
          chrome.storage.local.get(['bm_lang'], function(result) {
                  if(result.bm_lang){
                    resolve(result.bm_lang); 
                  }
                  else{
                    reject('Eror retriving bm_lang');
                  }
                  
          });
      }
      catch(e){

            if(localStorage.getItem('bm_lang') !== null){
              resolve(localStorage.getItem('bm_lang'));
            }
            else{
              resolve(navigator.language.split('-')[0]);
            }  
      }
  }); 

  const extractInfo = async () => {
      const data = await getInfo();
      return data;
  }

  return extractInfo();


}
