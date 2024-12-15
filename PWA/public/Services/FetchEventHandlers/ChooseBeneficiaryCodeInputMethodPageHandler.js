import { RouteEvents } from "../../RouteEvents.js";
import { ResponseTools } from "../ResponseTools.js";
export class ChooseBeneficiaryCodeInputMethodPageHandler {
    canHandleEvent(event) {
        return event.request.url.endsWith(RouteEvents.chooseBeneficiaryCodeInputMethod);
    }
    async handleEvent(event) {
        return ResponseTools.wrapInHtmlTemplate(RouteEvents.chooseBeneficiaryCodeInputMethodPage);
    }
}
