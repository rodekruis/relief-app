import { RouteEvents } from "../../RouteEvents.js";
import { ResponseTools } from "../ResponseTools.js";
export class DocumentationPageHandler {
    canHandleEvent(event) {
        return event.request.url.includes(RouteEvents.documentation);
    }
    async handleEvent(event) {
        return await ResponseTools.wrapInHtmlTemplate(RouteEvents.documentation);
    }
}
