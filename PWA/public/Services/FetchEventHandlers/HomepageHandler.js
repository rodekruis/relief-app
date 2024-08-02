import { RouteEvents } from "../../RouteEvents.js";
export class HomepageHandler {
    canHandleEvent(event) {
        return event.request.url.includes(RouteEvents.home);
    }
    async handleEvent(event) {
        return fetch(RouteEvents.home);
    }
}
