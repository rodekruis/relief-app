import { RouteEvents } from "../RouteEvents.js";
import { FetchEvent } from "../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../Interfaces/FetchEventHandler.js";
import { Database } from "../Services/Database.js";
import { DeserialisationService } from "../Services/DeserialisationService.js";
import { DeleteDistributionPost } from "../Models/DeleteDistributionPost.js";

export class DeleteDistributionPostHandler implements FetchEventHandler {
  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.endsWith(RouteEvents.postDeleteDistribution);
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    const post: DeleteDistributionPost = await DeserialisationService.deserializeFormDataFromRequest(event.request)
    const distributionToDelete = (await Database.instance.distributionsWithName(post.distrib_id))[0]

    await Database.instance.deleteDistributionWithName(distributionToDelete.distrib_name)

    return fetch(RouteEvents.home)
  }
}
