import { RouteEvents } from "../../RouteEvents.js";
import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { ResponseTools } from "../ResponseTools.js";

export class NameDistributionRequestHandler implements FetchEventHandler {
  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url
      .replace("?", "")
      .endsWith(RouteEvents.nameDistribution);
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    return ResponseTools
    .replaceTemplateKeysWithValues(
      await caches
      .match(event.request) as Response,
      { errorMessages: [] }
    )
  }
}