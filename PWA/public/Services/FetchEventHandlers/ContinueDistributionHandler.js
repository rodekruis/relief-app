import { RouteEvents } from "../../RouteEvents.js";
import { ResponseTools } from "../ResponseTools.js";
export class ContinueDistributionHandler {
    canHandleEvent(event) {
        return event.request.url.includes(RouteEvents.continueDistribution);
    }
    async handleEvent(event) {
        //TODO this should be context aware
        return await ResponseTools.wrapInHtmlTemplate(this.templatepageForInputMethod("text"));
    }
    templatepageForInputMethod(inputMethod) {
        if (inputMethod == "video") {
            return RouteEvents.codeInputUsingCamera;
        }
        else if (inputMethod == "text") {
            return RouteEvents.codeinputUsingTextField;
        }
        else {
            throw "Unexpected input method: " + inputMethod;
        }
    }
}
