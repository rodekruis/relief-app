import { RouteEvents } from "../../RouteEvents.js";
import { Database } from "../Database.js";
import { DeserialisationService } from "../DeserialisationService.js";
export class DeleteDistributionPostHandler {
    canHandleEvent(event) {
        return event.request.url.endsWith(RouteEvents.postDeleteDistribution);
    }
    async handleEvent(event) {
        const post = await DeserialisationService.deserializeFormDataFromRequest(event.request);
        const distributionToDelete = (await Database.instance.distributionsWithName(post.distrib_id))[0];
        await Database.instance.deleteDistributionWithName(distributionToDelete.distrib_name);
        return fetch(RouteEvents.home);
    }
}
