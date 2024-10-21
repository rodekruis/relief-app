import { RouteEvents } from "../../RouteEvents.js";
import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";

export class HomepageHandler implements FetchEventHandler {
  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.includes(RouteEvents.home);
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    const responseFromCache = await caches.match(event.request)
    if(responseFromCache) {
      console.log("Retrieved index from cache")
      return responseFromCache
    } else {
      console.log("Failed to retrief index from cache")
      return fetch(RouteEvents.home)
    }
  }
}
