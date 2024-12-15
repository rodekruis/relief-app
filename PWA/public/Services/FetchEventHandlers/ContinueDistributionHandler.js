import { RouteEvents } from "../../RouteEvents.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
import { ResponseTools } from "../ResponseTools.js";
export class ContinueDistributionHandler extends ActiveSessionContainer {
    canHandleEvent(event) {
        return event.request.url.includes(RouteEvents.continueDistribution);
    }
    async handleEvent(event) {
        if (this.activeSession.nameOfLastUsedDistributionInputMethod) {
            return await ResponseTools.wrapInHtmlTemplate(this.templatepageForInputMethod(this.activeSession.nameOfLastUsedDistributionInputMethod));
        }
        else {
            throw "Expected nameOfLastUsedDistributionInputMethod";
        }
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
