import { RouteEvents } from "../../RouteEvents.js";
import { ResponseTools } from "../ResponseTools.js";
export class ChooseBenificiaryCodeInputMethodPageHandler {
    canHandleEvent(event) {
        return event.request.url.endsWith(RouteEvents.chooseBenificiaryCodeInputMethod);
    }
    async handleEvent(event) {
        return ResponseTools.wrapInHtmlTemplate(RouteEvents.chooseBenificiaryCodeInputMethodPage);
    }
}
