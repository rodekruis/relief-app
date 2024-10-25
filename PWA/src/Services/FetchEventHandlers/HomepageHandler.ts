import { RouteEvents } from "../../RouteEvents.js";
import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { ResponseTools } from "../ResponseTools.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
import { DistributionResponseProvider } from "../DistributionResponseProvider.js";

export class HomepageHandler extends ActiveSessionContainer implements FetchEventHandler {
  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.includes(RouteEvents.home);
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    if(this.activeSession.nameOfLastViewedDistribution) {
      return await new DistributionResponseProvider(this.activeSession).responseForDistribution(this.activeSession.nameOfLastViewedDistribution)
    } else {
      return await ResponseTools.fetchFromCacheWithRemoteAsFallBack(RouteEvents.home)
    }
  }
}