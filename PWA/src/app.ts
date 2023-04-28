if ('serviceWorker' in navigator) {
  console.log("Will register serviceworker..")
  navigator.serviceWorker
    .register('/sw.js', { type: 'module' })
    .then(function() {
      console.log('Service worker registered!');
    });
} else {
  console.log('Service worker not supported in this browser..')
}