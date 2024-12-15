import { RouteEvents } from "../../RouteEvents.js";
import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { DeserialisationService } from "../DeserialisationService.js";
import { DeleteDistributionPost } from "../../Models/DeleteDistributionPost.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
import { ResponseTools } from "../ResponseTools.js";

export class DeleteDistributionPostHandler extends ActiveSessionContainer implements FetchEventHandler {
  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.endsWith(RouteEvents.postDeleteDistribution);
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    const post: DeleteDistributionPost = await DeserialisationService.deserializeFormDataFromRequest(event.request)
    const distributionToDelete = (await this.activeSession.database.distributionWithName(post.distrib_id))
    if(distributionToDelete) {
      await this.activeSession.database.deleteDistributionWithName(distributionToDelete.distrib_name)
    }
    
    return await ResponseTools.fetchFromCacheWithRemoteAsFallBack(RouteEvents.home)
  }
}
