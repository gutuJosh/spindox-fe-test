export default () => {

    const URL = 'https://www.bancomail.it/listino-email-completo/geo-json';

    function getDBFromServer(path){
            
        return new Promise((resolve) => { 

          const xhttp = new XMLHttpRequest();
          xhttp.open("GET", path, true);
          xhttp.send();
          xhttp.onreadystatechange = function(){
              if(this.readyState === 1){
                console.log('Server connection not started yet');
              }
              else if(this.readyState === 1){
                console.log('Server connection established');
              }
              else if(this.readyState === 2){
                console.log('Server has received the request');
              }
              else if(this.readyState === 3){
                console.log('Processing request...');
              }
              else if(this.readyState === 4 && this.status === 200) {
                 // request finished and response is ready:
                 resolve({'serverStatus' :  this.status, 'serverResponse' : xhttp.responseText});
              }
              else if(this.readyState === 4 && this.status !== 200){
                resolve({'serverStatus' :  this.status, 'serverResponse' : xhttp.responseText});
              }
              else{
                resolve({'serverStatus' :  this.status, 'serverResponse' : xhttp.responseText});
              }
          };
          xhttp.onerror = function(){
            resolve({'serverStatus' :  500, 'serverResponse' : 'Epic fail'});
          }
        });
      }

      async function loadData(){
        
        const getLists = await getDBFromServer(URL);
        if(getLists !== undefined && getLists.serverStatus === 200){
            postMessage({'serverStatus' :  200, 'serverResponse' : getLists.serverResponse});
        }
        else{
            postMessage(getLists);
        }

      }


      loadData();



}