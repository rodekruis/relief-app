import { RouteEvents } from "../../RouteEvents.js";
export class HomepageHandler {
    canHandleEvent(event) {
        return event.request.url.includes(RouteEvents.home);
    }
    async handleEvent(event) {
        const responseFromCache = await caches.match(event.request);
        if (responseFromCache) {
            console.log("Retrieved index from cache 🎉");
            return responseFromCache;
        }
        else {
            console.log("Failed to retrief index from cache :(");
            return fetch(RouteEvents.home);
        }
    }
}
