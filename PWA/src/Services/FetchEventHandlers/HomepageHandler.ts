import { RouteEvents } from "../../RouteEvents.js";
import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";

export class HomepageHandler implements FetchEventHandler {
  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.includes(RouteEvents.home);
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    return fetch(RouteEvents.home)
  }
}
