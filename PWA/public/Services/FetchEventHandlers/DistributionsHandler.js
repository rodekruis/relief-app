import { RouteEvents } from "../../RouteEvents.js";
import { ResponseTools } from "../ResponseTools.js";
export class DistributionsHandler {
    canHandleEvent(event) {
        return event.request.url.endsWith(RouteEvents.distributions);
    }
    async handleEvent(event) {
        return await ResponseTools.fetchFromCacheWithRemoteAsFallBack(RouteEvents.home);
    }
}
