import { RouteEvents } from "../../RouteEvents.js";
import { ResponseTools } from "../ResponseTools.js";
export class NameDistributionRequestHandler {
    canHandleEvent(event) {
        return event.request.url.includes(RouteEvents.nameDistribution);
    }
    async handleEvent(event) {
        return ResponseTools.wrapInHTPLTemplateAndReplaceKeysWithValues(RouteEvents.nameDistribution, { errorMessages: [] });
    }
}
