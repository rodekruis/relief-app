import { RouteEvents } from "../../RouteEvents.js";
import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { ResponseTools } from "../ResponseTools.js";
import { DeleteDistributionPost } from "../../Models/DeleteDistributionPost.js";
import { DeserialisationService } from "../DeserialisationService.js";

export class DeleteDistributionsConfirmHandler implements FetchEventHandler {
  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.endsWith(RouteEvents.postDeleteDistributionConfirm);
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    const post: DeleteDistributionPost = await DeserialisationService.deserializeFormDataFromRequest(event.request)
    
    return await ResponseTools.wrapInHTPLTemplateAndReplaceKeysWithValues(
      RouteEvents.confirmDistributionDeletion, 
      {"distrib_id": post.distrib_id}
    )
  }
}
