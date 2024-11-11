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

Given the app is first installed
  When launched
    Then main menu is shown

Given main menu is shown
  When create new distribution button is tapped
    Then create distribution screen is shown
  
  And no distributions have been added yet
    When tapping select distribution button
      Then "No distributions found!" message is shown
        When tapping "create new distribution button"
          Then create new distribution page is shown
  
  And one or more distributions have been added
    When tapping select distribution button
      Then all added distributions are listed
        When tapping the name of a distribution
          Then the distribution page is shown

Given create new distribution page is shown
  When all fields are filled in
  and Distribution name doesn't exist yet
  and selected date is in the future
  and Create button is tapped
    Then distribution page is shown

  When all fields are filled in
  and Distribution name already exists
  and selected date is in the future
  and Create button is tapped
    Then red box appears with message "Distribution <name> already exists"

  When all fields are filled in
  and Distribution name doesn't exist yet
  and selected date is in the past
  and Create button is tapped
  and device is iOS
    Then message appears above date field: "Value must be greater than or equal to <current date>"

Given distribution page is shown
  Then distribution name is listed
  and distibution location is listed

  and no beneficiaries have been added (yet)
    Then "No beneficiary data found" message is shown
    and "Add beneficiary button" is visible

  and <numberOfBeneficiaries> beneficiaries have been added
    Then "beneficiaries served: (0 / <numberOfBeneficiaries>)" is shown
    and "Add beneficiary button" is hidden

    When distribution is started or resumed
      using typing or scanner
        When scanning code for eligle beneficary
          Then green box appears showing beneficiary details
            When marking as receipient
              and going back to distribution page
                Then "beneficiaries served: (1 / <numberOfBeneficiaries>)" is shown
            When continuing distribution
              and going back to distribution page
                Then "beneficiaries served: (0 / <numberOfBeneficiaries>)" is shown
            When going back to main menu
              Then "beneficiaries served: (0 / <numberOfBeneficiaries>)" is shown

        When scanning code for ineligible beneficiary
          Then red box appears showing beneficiary details
            When pressing Mark as recepient

        When scanning unknown code
      using camera 

Given no distributions are known (yet)
  When tapping home button
    Then main menu is shown

Given one or more distributions are known
  When tapping home button
    Then distribution page of last viewed distribution is shown

#### High demanding scenarios

Scenario: Correct beneficiaries served message
Given a distribution has been created and beneficiaries have been added
  When each beneficiary has individually been mark

Scenario: correct cleanup of previous distribution
Given a distribution is added
  And beneficiaries are added to that distribution
  And distribution is deleted
    When new distribution with same name as previous distribution is added
      Then it new distribution has no beneficiaries
