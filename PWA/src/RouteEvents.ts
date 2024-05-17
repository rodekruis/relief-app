export class RouteEvents {
    static home = "/index.html"
    static distributionsHome = "/distrib.html"
    static nameDistribution = "/name_distrib.html"
    static listDistributions = "/list_distrib.html"
    static listDistributionsEmptyState = "no_distrib.html"
    static deleteDistribution = "/list_distrib_delete.html"
    static uploadData = "/upload_data.html"
    static viewData = "/view_data.html"
    static uploadDataError = "/upload_error.html"
    static template = "/template.html"
    static chooseBenificiaryCodeInputMethodPage = "/choose_input_method.html"
    static codeInputUsingCamera = "/input_video.html"
    static codeinputUsingTextField = "/input.html"
    static codeInputNotFound = "/entry_not_found.html"
    static codeInputFound = "/entry.html"

    //Non page route events
    static postCreateDistribution = "/create_distrib"
    static postSelectDistribution = "/select_distrib"
    static postDeleteDistribution = "/delete_distrib_confirm"
    static listDistributionsFormAction = "/distrib?"
    static chooseBenificiaryCodeInputMethod = "/choose_input_method?"
    static selectBenificiaryCodeInputMethod = "/save_input_method"
    static checkBenificiaryCodeInputMethod = "/entry?"
  }