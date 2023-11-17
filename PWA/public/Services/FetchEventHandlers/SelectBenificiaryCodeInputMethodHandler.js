import { RouteEvents } from "../../RouteEvents.js";
import { DeserialisationService } from "../DeserialisationService.js";
import { ResponseTools } from "../ResponseTools.js";
export class SelectBenificiaryCodeInputMethodHandler {
    canHandleEvent(event) {
        return event.request.url.endsWith(RouteEvents.selectBenificiaryCodeInputMethod);
    }
    async handleEvent(event) {
        try {
            const post = await DeserialisationService.deserializeFormDataFromRequest(event.request);
            return ResponseTools.wrapInHtmlTemplate(this.templatepageForInputMethod(post.input_method));
        }
        catch (error) {
            console.error(error);
            return fetch(RouteEvents.home);
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
