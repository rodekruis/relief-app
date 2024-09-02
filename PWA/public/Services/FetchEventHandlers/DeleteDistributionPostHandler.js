import { RouteEvents } from "../../RouteEvents.js";
import { DeserialisationService } from "../DeserialisationService.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
export class DeleteDistributionPostHandler extends ActiveSessionContainer {
    canHandleEvent(event) {
        return event.request.url.endsWith(RouteEvents.postDeleteDistribution);
    }
    async handleEvent(event) {
        const post = await DeserialisationService.deserializeFormDataFromRequest(event.request);
        const distributionToDelete = (await this.activeSession.database.distributionWithName(post.distrib_id));
        if (distributionToDelete) {
            await this.activeSession.database.deleteDistributionWithName(distributionToDelete.distrib_name);
        }
        return fetch(RouteEvents.home);
    }
}
