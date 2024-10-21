import { RouteEvents } from "../../RouteEvents.js";
import { ResponseTools } from "../ResponseTools.js";
export class DeleteDistributionsConfirmHandler {
    canHandleEvent(event) {
        return event.request.url.endsWith(RouteEvents.postDeleteDistributionConfirm);
    }
    async handleEvent(event) {
        return await ResponseTools.wrapInHtmlTemplate(RouteEvents.confirmDistributionDeletion);
    }
}
