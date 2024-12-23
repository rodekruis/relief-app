import { RouteEvents } from "../../RouteEvents.js";
import { ResponseTools } from "../ResponseTools.js";
export class UploadDataHandler {
    canHandleEvent(event) {
        return event.request.url.endsWith("/upload_data?");
    }
    async handleEvent(event) {
        return ResponseTools.wrapInHtmlTemplate(RouteEvents.uploadData);
    }
}
