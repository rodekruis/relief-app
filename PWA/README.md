# Reliefbox Progressive web app
Offline version of reliefbox, built using typescript and relying heavily on service workers and IDB database. Upon installation the app works 100% offline, from this point on no backend calls are done anymore.

### During development

Make sure all terninal tabs are in the PWA directory, then run:
`npm start` to launch the local server
`tsc --watch` to make sure typescript files get compiled as you code
`npm run test -- --watch` to make sure run as you code

* All new files need to be added to `CachePathFileService`
* All new `FetchEventHandler` classes need to be added to `FetchEventHandlers`

#### Versioning
The apps version is stored in package.json and index.html current way to update this is by simply find replacing the previous version with the new one, making sure only the two files above are effected.

### Architercture / dataflow

1. HTTP requests are handled by serviceworker
2. Service worker dispatches request to `FetchEventHandlers`
3. `FetchEventHandlers` chooses which `FetchEventHander` should handle the request
4. `FetchEventHandler` handles the request and serves a new page using `ResponseTools` and using a service if there's been a need for shared or separated logic.
5. `ResponseTools` leverages the mustache templating system to render pages with the least amount of redundancy

#### Special note about templating
All pages exept index.html are rendered using template.html. The reason this isn't done for index.html is that the templating system is part of what's handled by the serviceworker, which isn't used yet when loading this first page. Because of this, there's some overlap between index.html and template.html

### IDB Database schema

* Beneficiary
    * Contains all the info of a beneficary
      * As provided by user from spreadsheet
    * Contains the info regarding the receival of goods
    * Containtains the info to which distribution the beneficiary belongs
* Distribution
    * Contains all the info of a distribution

### Third party code used
* [SheetJS](https://sheetjs.com) (PWA/public/ExternalLibraries/xlsx.full.min.js)
  * For handling spreadsheat files
* [Mustache](https://github.com/janl/mustache.js/) (PWA/public/ExternalLibraries/mustache.js)
    * For html templating
* [Zxing](https://github.com/zxing-js/library) (PWA/public/ExternalLibraries/zxing.js)
  * For barcode scanning
* [Bulma.io](https://bulma.io) (PWA/public/ExternalLibraries/bulma.css)
  * For page styling styling

### Deployment
* Compiled code is found in public folder
  * As configured in PWA/tsconfig.json
* Github actions is used for deployment of that folder
  * on push as configured in .github/workflows/azure-static-web-apps-black-stone-02fb10f03.yml
  * app will be deployed to reliefbox.510.global


### Test scripts

Codes in template:
1 Aric Norwood
2 Lira Calloway
3 Daven Morrell
Features & verifications:
* Creating a distribution
  * Verify that:
    * Distribution with same name can't be added twice
    * Distribution can't have date in the past
    * All fields need to be entered
* Listing a distribution
  * Verify that:
    * Distribution name is shown
    * Distribution data is shown
    * When no beneficary data is added yet:
      * No beneficiary data found message is shown
    * When beneficiary data is added
      * It shows the amount of served beneficaries
    * Beneficiary data can be addded
    * Distribution can be started / resumed
    * Missing beneficiaries can be checked
    * Downloading beneficiary data
* Adding beneficary data to a distribution
  * Verify that:
    * When adding a non supported file, a spreadsheat without a "code" column or a spreadsheat with duplicate codes
      * "Data" in wrong format screen is displayed
      * Data template can be downloaded
    * When adding a supported spreadsheet
      * It navigates to distribution page
* Viewing beneficiary data
  * Verify that:
    * All rows and columns from uploaded spreadsheet are displayed
    * Go back to main menu button results in navigation to distribution
* Starting / resuming a distribution
  * Verify that:
     * Tapping "Using camera" button results in scanning input screen
     * Tapping "By typing" button results in text input screen
* Checking code using camera
  * Verify that
    * Camera can be selected when there's multiple options available
    * Pointing at a code results in navigating to code verification result page
* Checking code by typing
 * Verify that:  
    * Code can be submitted
* Viewing code verification result page
  * Verify that
    * When code doesn't exist, it mentions that beneficary is not found
    * When code is known and isn't scanned before
      * Green beneficiary data is reveiled using green box
      * Can be marked as recipient
        * Results in code input using last used input method
      * Can be ignored by pressing continue distribution
      * Can be ignored by pressing go back to main menu
        * Distribution is listed again
    * When code is already scanned
* Checking missing beneficiaries
  * Verify that:
    * When there's still beneficiaries left
      * Only the non served beneficiaries are shown
    * When all beneficiaries have been served
      * No beneficiaries found message is shown
* Download data template
  * Verify that it can be downloaded
  * Verify that it can be used in a distribution
* Downloading beneficiary data
  * Verify that:
    * This results in a spreadsheet with all rows and columns from uploaded spreadsheet, but with two added columns that describe if and when the beneficiary has been marked as a recepient.
* Changing distribution
  * Verify that
    * When there's not distributions
      * "No distributions found!" is shown
    * When there are distributions
      * They can be changed to
* Deleting a distribution
  * Verify that:
    * When there's no distributions
      * "No distributions found!" is shown
    * When there are distributions
      * Distributions are listed and can be deleted upon confirmation and deletion can be canceled upon canceling


For extra endurance testing:
* Make sure all of the above works with multiple distributions
* Make sure all of the above works with both different and the same distribution lists