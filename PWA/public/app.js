"use strict";
if ('serviceWorker' in navigator) {
    console.log("Will register serviceworker..");
    navigator.serviceWorker
        .register('/sw.js', { type: 'module' })
        .then(function () {
        console.info('Service worker registered!');
    });
}
else {
    console.error('Service worker not supported in this browser..');
}
