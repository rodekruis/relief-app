import { RouteEvents } from "../../RouteEvents.js";
export class UploadDataHandler {
    canHandleEvent(event) {
        return event.request.url.endsWith("/upload_data?");
    }
    async handleEvent(event) {
        return fetch(RouteEvents.uploadData);
    }
}
