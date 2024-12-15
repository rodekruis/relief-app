import { RouteEvents } from "../../RouteEvents.js";
import { ResponseTools } from "../ResponseTools.js";
import { DeserialisationService } from "../DeserialisationService.js";
export class DeleteDistributionsConfirmHandler {
    canHandleEvent(event) {
        return event.request.url.endsWith(RouteEvents.postDeleteDistributionConfirm);
    }
    async handleEvent(event) {
        const post = await DeserialisationService.deserializeFormDataFromRequest(event.request);
        return await ResponseTools.wrapInHTPLTemplateAndReplaceKeysWithValues(RouteEvents.confirmDistributionDeletion, { "distrib_id": post.distrib_id });
    }
}
