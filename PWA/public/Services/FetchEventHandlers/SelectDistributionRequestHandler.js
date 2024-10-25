import { RouteEvents } from "../../RouteEvents.js";
import { DeserialisationService } from "../DeserialisationService.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
import { DistributionResponseProvider } from "../DistributionResponseProvider.js";
export class SelectDistributionRequestHandler extends ActiveSessionContainer {
    canHandleEvent(event) {
        return event.request.url.endsWith(RouteEvents.postSelectDistribution);
    }
    async handleEvent(event) {
        const post = await DeserialisationService.deserializeFormDataFromRequest(event.request);
        return await new DistributionResponseProvider(this.activeSession).responseForDistribution(post.distrib_name);
    }
    isFilled(field) {
        return field.length != 0;
    }
}
