setTimeout(function() {
    /* Example: Send data from the page to your Chrome extension */
    document.dispatchEvent(new CustomEvent('BANCOMAIL_connectExtension', {
        detail: window.location // Some variable
    }));

}, 0);