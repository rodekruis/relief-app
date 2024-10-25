import { RouteEvents } from "../../RouteEvents.js";
import { ResponseTools } from "../ResponseTools.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
import { DistributionResponseProvider } from "../DistributionResponseProvider.js";
export class HomepageHandler extends ActiveSessionContainer {
    canHandleEvent(event) {
        return event.request.url.includes(RouteEvents.home);
    }
    async handleEvent(event) {
        if (this.activeSession.nameOfLastViewedDistribution) {
            return await new DistributionResponseProvider(this.activeSession).responseForDistribution(this.activeSession.nameOfLastViewedDistribution);
        }
        else {
            return await ResponseTools.fetchFromCacheWithRemoteAsFallBack(RouteEvents.home);
        }
    }
}
