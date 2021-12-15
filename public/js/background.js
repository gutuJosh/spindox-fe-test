/*global chrome*/
var evtSource = false;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({'bm_lang': navigator.language.split('-')[0]}, function() {
       return;
    });
    chrome.storage.local.set({'bm_my_lists': JSON.stringify([])}, function() {
        return;
     });
});


chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.bm_my_lists?.newValue) {
      //stop sse connection 
      if(evtSource){
        console.log('close EventSource');
         evtSource.close();
      }
      watchMyLists(); 
    }
});


chrome.runtime.onStartup.addListener(() => {
    console.log('onStartup....');
    if(evtSource){
        evtSource.close();
    }
    //start sse connection
    watchMyLists();
});


function watchMyLists(){
    chrome.storage.local.get(['bm_my_lists'], function(result) {  
       if(result.bm_my_lists){
        let getLists = JSON.parse(result.bm_my_lists);
        const watchLists = getLists.filter( item => item.updates === true);
        if(watchLists.length > 0){
            console.log('open EventSource');
            evtSource = new EventSource("http://www.oravita-anina.eu/ssedemo.php?items="+encodeURIComponent(JSON.stringify(watchLists)));
            evtSource.addEventListener("ping", function(event) {
                const data = JSON.parse(event.data);
                const ids = [];
               
                const updates = data.filter((item) => typeof item.updatesInfo !== 'undefined');
                updates.filter((item) => ids.push(item.pi));
               
                updates.forEach( item => {
                    getLists.forEach( element => {
                      if(item.pi === element.pi && item.updatesInfo){
                          element.updates = false;
                          element.updatesInfo = item.updatesInfo;
                      }
                    });
                });
                console.log(getLists);
                chrome.storage.local.set({'bm_my_lists': JSON.stringify(getLists)}, function() {
                    chrome.notifications.create('bm_test', {
                        type: 'basic',
                        iconUrl: 'icons/launcher-icon-2x.png',
                        title: chrome.i18n.getMessage('bmMsgTitle'),
                        message: chrome.i18n.getMessage('bmMsgDescr'),
                        buttons: [
                            {
                                title: chrome.i18n.getMessage('bmMsgBtnLabel')
                            }
                        ],
                        priority: 2
                    });
                    /* Respond to the user's clicking one of the buttons */
                    chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
                            if (notifId === 'bm_test') {
                                //evtSource.close();
                                window.open(`https:www.bancomail.it/liste-email/carrello?packs=${ids.join(',')}`, "_blank");
                                //chrome.tabs.create({url: `https:www.bancomail.it/liste-email/carrello?packs=${ids.join(',')}`, active: true});
                                //window.open("index.html", "extension_popup", "width=550,height=520,status=no,scrollbars=none,resizable=no");
                            }
                     });
                     /* Add this to also handle the user's clicking 
                    * the small 'x' on the top right corner */
                    chrome.notifications.onClosed.addListener(function() {
                        evtSource.close();
                    });
                 });

                 //update extension badge
                 chrome.browserAction.setBadgeBackgroundColor({ color: '#25baa5' }, () => {
                    chrome.browserAction.setBadgeText({text: `${watchLists.length}` }, () => false);
                 });
                
                 /*chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    if(tabs.length > 0){
                        chrome.tabs.sendMessage(tabs[0].id, {message: {'data' : data, 'status' : 'we have updates'}}, function(response) {
                        console.log(response);
                        if (!chrome.runtime.lastError) { // if we have any response
                            if(response.contentResponse === 'roger'){
                                //evtSource.close();
                                console.log('roger');
                            }
                        }
                        else{
                            // if we don't have any response it's ok but we should actually handle it
                            //and we are doing this when we are examining chrome.runtime.lastError
                            console.log(chrome.runtime.lastError);
                        }
                        });
                    }
                    else{
                    // evtSource.close();
                    }
                });*/
          
            });
            evtSource.onerror = function(err) {
                console.error("EventSource failed:", err);
            };
        }
        else{
            console.log('No lists to watch 4');
        }
       }
       else{
           console.log('No saved lists');
       }
    });  
}

watchMyLists();



