/*global chrome*/
var s = document.createElement('script');
s.src = chrome.extension.getURL('js/script.js');
(document.head||document.documentElement).appendChild(s);
s.onload = function() {
    s.remove();
};

// Event listener
document.addEventListener('BANCOMAIL_connectExtension', function(e) {
    // e.detail contains the transferred data (can be anything, ranging
    // from JavaScript objects to strings).
    // Do something, for example:
    chrome.storage.local.get(['bm_my_lists'], function(result) {  
      
            const myLists = result.bm_my_lists ? JSON.parse(result.bm_my_lists) : [];
            const container = document.querySelectorAll('.email-pack');
            if(container !== null){
                container.forEach( item => {
                    let list = JSON.parse(item.dataset.pack);
                    let savedList = myLists.filter( element => element.pi === list.id);
                    let btn = document.createElement('span');
                    let icn = document.createElement('i');
                    icn.className = "icon-refresh tip text-grey";
                    if(savedList.length > 0 && savedList.updates){
                      icn.classList.add('icon-spin');
                    }
                    btn.appendChild(icn);
                    btn.setAttribute('data-ttip', chrome.i18n.getMessage('bmSyncBtnLabel'));
                    btn.style = "cursor:pointer;position:absolute;top:20px;right:5px";

                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        let target = e.target.tagName === "SPAN" ? e.target.childNode : e.target;
                        target.classList.toggle('icon-spin');
                 
                        let getMyLists = target.classList.contains('icon-spin') ? myLists.filter( item => item.pi === list.id) : myLists.filter( item => item.pi !== list.id);
                          
                            if(getMyLists.length === 0 && target.classList.contains('icon-spin') === true){
                                myLists.push({//replace object with fetch data
                                    'pi' : list.id,
                                    'pn' : list.macrocategoria,
                                    'iso' : list.nazione,
                                    'n' : list.naz_name,
                                    're' : list.regione === null ? 'Tutte le regioni' :  list.regione,
                                    'd' : list.sconto,
                                    'p' : list.price.replace(/,/g, '.').replace(/€|&nbsp;|\$/g,''),
                                    'i' : list.tot_anag,
                                    'updates' : true,
                                    'watch' : Date.now() 
                                    });
                            }

                            const listToSave = target.classList.contains('icon-spin') ? JSON.stringify(myLists) : JSON.stringify(getMyLists);
                        
                            chrome.storage.local.set({'bm_my_lists': listToSave}, function() {
                                console.log(listToSave);
                                return;
                            });

                    }, false);

                    item.lastElementChild.appendChild(btn);
                });
            }
        
    });
});