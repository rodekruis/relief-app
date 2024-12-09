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

Test devices
* iPhone 15
  * iOS 18.1.1
* Alcatel 1B
  * Android (Alcatel UI) v9L3D(11-14)

Test result legend
✅ Working as intended on tested device
🟠 Not working as intended, with workaround / non blocking
⛔️ Not working on tested device, no workaround

Installing
  * App can be installed and launched from homescreen
    ✅ iPhone 15 (0.24.4)
    🟠 Alcatel 1B
      Add to homepage stopped working on this device. It says open reliefbox instead.
      Currently best known workaround: launching the app from the app launcher. Since this doesn't seem to happen on other
      android devices, it may be device specific thing, where PWA data isn't removed properly.
Features & verifications:
* Creating a distribution
  * Verify that:
    * Distribution with same name can't be added twice
      ✅ iPhone 15 (0.24.4)
      ✅ Alcatel 1B (0.24.4)
    * Distribution can't have date in the past
      ✅ iPhone 15 (0.24.4)
      ✅ Alcatel 1B (0.24.4)
    * All needed fields need to be entered (Donor and items distributied are optional)
      ✅ iPhone 15 (0.24.4)
      ✅ Alcatel 1B (0.24.4)
* Listing a distribution
  * Verify that:
    * Distribution name is shown
      ✅ iPhone 15 (0.24.4)
      ✅ Alcatel 1B (0.24.4)
    * Distribution data is shown (location and date)
      ✅ iPhone 15 (0.24.4)
      ✅ Alcatel 1B (0.24.4)
    * When no beneficary data is added yet:
      * No beneficiary data found message is shown
        ✅ iPhone 15 (0.24.4)
        ✅ Alcatel 1B (0.24.4)
    * When beneficiary data is added
      * It shows the amount of served beneficaries
        ✅ iPhone 15 (0.24.4)
        ✅ Alcatel 1B (0.24.4)
    * Beneficiary data can be addded
      ✅ iPhone 15 (0.24.4)
      ✅ Alcatel 1B (0.24.4)
    * Distribution can be started / resumed
      ✅ iPhone 15 (0.24.4)
    * Missing beneficiaries can be checked
      ✅ iPhone 15 (0.24.4)
      ✅ Alcatel 1B (0.24.4)
        Results in site can't be reached page
    * Beneficiary can be downloaded
      🟠 iPhone 15 (0.24.4)
          Dialog can't be dismissed [#24](https://github.com/rodekruis/reliefbox/issues/24)
      ✅ Alcatel 1B (0.24.4)
* Adding beneficary data to a distribution
  * Verify that:
    * When adding a non supported file, a spreadsheat without a "code" column or a spreadsheat with duplicate codes
      * "Data" in wrong format screen is displayed
        ✅ iPhone 15 (0.24.4)
        ✅ Alcatel 1B (0.24.4)
      * Data template can be downloaded
        🟠 iPhone 15 (0.24.4)
          Dialog can't be dismissed [#24](https://github.com/rodekruis/reliefbox/issues/24)
        🟠 Alcatel 1B (0.24.4)
          Very minor: when template has been downloaded before, lives in downloads and name isn't changed, app navigates straight to distribution
          workaround: leveraging the already downloaded template.
      * "Go back to main menu" button works
        ✅ iPhone 15 (0.24.4)
        ✅ Alcatel 1B (0.24.4)
    * When adding a supported spreadsheet
      * It navigates to distribution page
        ✅ iPhone 15 (0.24.4)
        ✅ Alcatel 1B (0.24.4)
* Viewing beneficiary data
  * Verify that:
    When beneficiary data has been added
      * All rows and columns from uploaded spreadsheet are displayed
        ✅ iPhone 15 (0.24.4)
        ✅ Alcatel 1B (0.24.4)
      * Go back to main menu button results in navigation to distribution
        ✅ iPhone 15 (0.24.4)
        ✅ Alcatel 1B (0.24.4)
    When no beneficiary data has been added
      * "No beneficiary data found!" message is shown
        ✅ iPhone 15 (0.24.4)
        ✅ Alcatel 1B (0.24.4)
      * Go back to main menu button results in navigation to distribution
        ✅ iPhone 15 (0.24.4)
        ✅ Alcatel 1B (0.24.4)
* Starting / resuming a distribution
  * Verify that:
     * Tapping "Using camera" button results in scanning input screen
      ✅ iPhone 15 (0.24.4)
      ✅ Alcatel 1B (0.24.4)
     * Tapping "By typing" button results in text input screen
      ✅ iPhone 15 (0.24.4)
      ✅ Alcatel 1B (0.24.4)
* Checking code using camera
  * Verify that
    * Camera can be selected when there's multiple options available
      ✅ iPhone 15 (0.24.4)
        (on iPhone there's only one option)
      ✅ Alcatel 1B (0.24.4)
        (seemed to have only one option)
    * Pointing at a code results in navigating to code verification result page
      ✅ iPhone 15 (0.24.4)
      ✅ Alcatel 1B (0.24.4)
* Checking code by typing
 * Verify that:  
    * Code can be submitted
      ✅ iPhone 15 (0.24.4)
      ✅ Alcatel 1B (0.24.4)
* Viewing code verification result page
  * Verify that
    * When code doesn't exist, it mentions that beneficary is not found
      * Continue distribution works
        ✅ iPhone 15 (0.24.4)
        ✅ Alcatel 1B (0.24.4)
      * Go back to main menu works
        ✅ iPhone 15 (0.24.4)
        ✅ Alcatel 1B (0.24.4)
    * When code is known and isn't scanned before
      * Beneficiary data is reveiled using green box
        ✅ iPhone 15 (0.24.4)
        ✅ Alcatel 1B (0.24.4)
      * Can be marked as recipient
        * Results in code input using last used input method
          ✅ iPhone 15 (0.24.4)
          ✅ Alcatel 1B (0.24.4)
      * Can be ignored by pressing continue distribution
        ✅ iPhone 15 (0.24.4)
        ✅ Alcatel 1B (0.24.4)
      * Can be ignored by pressing go back to main menu
        ✅ iPhone 15 (0.24.4)
        ✅ Alcatel 1B (0.24.4)
    * When code is already submitted
      * Beneficiary data is reveiled using red box
        ✅ iPhone 15 (0.24.4)
        ✅ Alcatel 1B (0.24.4)
* Checking missing beneficiaries
  * Verify that:
    * When there's still beneficiaries left
      * Only the non served beneficiaries are shown
        ✅ iPhone 15 (0.24.4)
        ✅ Alcatel 1B (0.24.4)
    * When all beneficiaries have been served
      * No beneficiaries found message is shown
        ✅ iPhone 15 (0.24.4)
        ✅ Alcatel 1B (0.24.4)
* Downloading beneficiary data
  * Verify that:
    * This results in a spreadsheet with all rows and columns from uploaded spreadsheet, but with two added columns that describe if and when the beneficiary has been marked as a recepient.
      ✅ iPhone 15 (0.24.4)
      ✅ Alcatel 1B (0.24.4)
* Changing distribution
  * Verify that
      * They can be changed to
        ✅ iPhone 15 (0.24.4)
        ✅ Alcatel 1B (0.24.4)
* Deleting a distribution
  * Verify that:
    * When there's no distributions
      * "No distributions found!" is shown
        ✅ iPhone 15 (0.24.4)
        ✅ Alcatel 1B (0.24.4)
      * "Create new distribution" button works
        ✅ iPhone 15 (0.24.4)
        ✅ Alcatel 1B (0.24.4)
    * When there are distributions
      * Distributions are listed and can be deleted upon confirmation and deletion can be canceled upon canceling
        ✅ iPhone 15 (0.24.4)
        ✅ Alcatel 1B (0.24.4)

For extra endurance testing:
* Make sure all of the above works with multiple distributions
* Make sure all of the above works with both different and the same distribution lists

Useful tool when testing
[Online barcode generator](https://barcode.tec-it.com/en)

#### Regression observations
🟠 Huawei P30 (0.24.2), Alcatel 1B (0.24.4)
  In some cases an action may result in "This site can't be reached" message. Restarting the app or going back and performing the action again, seems to resolve this. May be more stable on newer devices (currently unclear).