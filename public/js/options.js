/*global chrome*/

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('selectorLabel').textContent = chrome.i18n.getMessage('languageSelector');
    document.getElementById('save').textContent = chrome.i18n.getMessage('saveOptionsBtn');
    chrome.storage.local.get(['bm_lang'], function(result) {  
        if(result.bm_lang){
            document.querySelectorAll('input[name="language"]').forEach( item => {
                if(item.value === result.bm_lang){
                    item.checked = true;
                }
            });
        }
    });
}, false);


document.getElementById('save').addEventListener('click', (e) => {

  

    document.querySelectorAll('input[name="language"]').forEach( item => {
        if(item.checked === true){
            chrome.storage.local.set({'bm_lang': item.value}, function() {
                var status = document.getElementById('status');
                status.textContent =  chrome.i18n.getMessage('saveOptionStatus');
                setTimeout(function() {
                    status.textContent = '';
                  }, 750);
                return;
            });
        }
    });

}, false);