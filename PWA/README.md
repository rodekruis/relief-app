# Reliefbox Progressive web app
Offline version of reliefbox, built using typescript and relying heavily on service workers and IDB database.

### During development

Make sure all terninal tabs are in the PWA directory, then run:
`npm start` to launch the local server
`tsc --watch` to make sure typescript files get compiled as you code
`npm run test -- --watch` to make sure run as you code

* All new files need to be added to `CachePathFileService`
* All new `FetchEventHandler` classes need to be added to `FetchEventHandlers`

### Architercture / dataflow

1. HTTP requests are handled by serviceworker
2. Service worker dispatches request to `FetchEventHandlers`
3. `FetchEventHandlers` chooses which `FetchEventHander` should handle the request
4. `FetchEventHandler` handles the request and serves a new page using `ResponseTools` and using a service if there's been a need for shared or separated logic.
5. `ResponseTools` leverages the mustache templating system to render pages with the least amount of redundancy

### IDB Database schema

* Beneficiary
    * Contains all the info of a beneficary
* Distribution
    * Contains all the info of a distribution
* DistributionBeneficary
  * Contains the info of 
    * which beneficary belongs to which distribution
    * wether or not the beneficiary has received  it's goods

### Third party code used
* [SheetJS](https://sheetjs.com) (PWA/public/ExternalLibraries/xlsx.full.min.js)
  * For handling spreadsheat files
* [Mustache](https://github.com/janl/mustache.js/) (PWA/public/ExternalLibraries/mustache.js)
    * For html templating
* [Zxing](https://github.com/zxing-js/library) (PWA/public/ExternalLibraries/zxing.js)
  * For barcode scanning
* [Bulma.io](https://bulma.io) (PWA/public/ExternalLibraries/bulma.css)
  * For page styling styling