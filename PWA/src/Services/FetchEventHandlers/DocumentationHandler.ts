import { RouteEvents } from "../../RouteEvents.js";
import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { ResponseTools } from "../ResponseTools.js";

export class DocumentationHandler implements FetchEventHandler {
  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.includes(RouteEvents.documentation);
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    return await ResponseTools.wrapInHtmlTemplate(RouteEvents.documentation)
  }
}