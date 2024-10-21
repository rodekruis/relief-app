import { RouteEvents } from "../../RouteEvents.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
import { DeserialisationService } from "../DeserialisationService.js";
import { ResponseTools } from "../ResponseTools.js";
export class SelectBeneficiaryCodeInputMethodHandler extends ActiveSessionContainer {
    canHandleEvent(event) {
        return event.request.url.endsWith(RouteEvents.selectBeneficiaryCodeInputMethod);
    }
    async handleEvent(event) {
        try {
            const post = await DeserialisationService.deserializeFormDataFromRequest(event.request);
            return ResponseTools.wrapInHtmlTemplate(this.templatepageForInputMethod(post.input_method));
        }
        catch (error) {
            console.error(error);
            return await ResponseTools.fetchFromCacheWithRemoteAsFallBack(RouteEvents.home);
        }
    }
    templatepageForInputMethod(inputMethod) {
        this.activeSession.nameOfLastUsedDistributionInputMethod = inputMethod;
        if (inputMethod == "video") {
            this.activeSession.nameOfLastUsedDistributionInputMethod = inputMethod;
            return RouteEvents.codeInputUsingCamera;
        }
        else if (inputMethod == "text") {
            this.activeSession.nameOfLastUsedDistributionInputMethod = inputMethod;
            return RouteEvents.codeinputUsingTextField;
        }
        else {
            throw "Unexpected input method: " + inputMethod;
        }
    }
}
