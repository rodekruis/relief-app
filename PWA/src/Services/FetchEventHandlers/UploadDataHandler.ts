import { RouteEvents } from "../../RouteEvents.js";
import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";

export class UploadDataHandler implements FetchEventHandler {
  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.endsWith("/upload_data?");
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    return fetch(RouteEvents.uploadData)
  }
}
