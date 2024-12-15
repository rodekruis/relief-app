import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { RouteEvents } from "../../RouteEvents.js";
import { ResponseTools } from "../ResponseTools.js";

export class DistributionsHandler implements FetchEventHandler {
  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.endsWith(RouteEvents.distributions);
  }

  async handleEvent(event: FetchEvent): Promise<Response | undefined> {
    return await ResponseTools.fetchFromCacheWithRemoteAsFallBack(RouteEvents.home);
  }
}
