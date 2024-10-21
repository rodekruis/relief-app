import { RouteEvents } from "../../RouteEvents.js";
import { ResponseTools } from "../ResponseTools.js";
export class HomepageHandler {
    canHandleEvent(event) {
        return event.request.url.includes(RouteEvents.home);
    }
    async handleEvent(event) {
        return await ResponseTools.fetchFromCacheWithRemoteAsFallBack(RouteEvents.home);
    }
}
