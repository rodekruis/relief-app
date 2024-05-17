import { RouteEvents } from "../../RouteEvents.js";
import { ResponseTools } from "../ResponseTools.js";
export class NameDistributionRequestHandler {
    canHandleEvent(event) {
        return event.request.url
            .replace("?", "")
            .endsWith(RouteEvents.nameDistribution);
    }
    async handleEvent(event) {
        return ResponseTools
            .replaceTemplateKeysWithValues(await caches
            .match(event.request), { errorMessages: [] });
    }
}
