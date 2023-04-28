import { RouteEvents } from "../RouteEvents.js";
import { ResponseTools } from "../Services/ResponseTools.js";
export class ChooseBenificiaryCodeInputMethodHandler {
    canHandleEvent(event) {
        return event.request.url.endsWith(RouteEvents.chooseBenificiaryCodeInputMethod);
    }
    async handleEvent(event) {
        return ResponseTools.wrapInHtmlTemplate(RouteEvents.chooseBenificiaryCodeInputMethodPage);
    }
}
