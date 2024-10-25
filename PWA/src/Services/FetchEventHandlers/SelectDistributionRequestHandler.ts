import { RouteEvents } from "../../RouteEvents.js";
import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { SelectDistributionPost } from "../../Models/SelectDistributionPost.js";
import { DeserialisationService } from "../DeserialisationService.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
import { DistributionResponseProvider } from "../DistributionResponseProvider.js";

export class SelectDistributionRequestHandler extends ActiveSessionContainer implements FetchEventHandler {
  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.endsWith(RouteEvents.postSelectDistribution);
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    const post: SelectDistributionPost = await DeserialisationService.deserializeFormDataFromRequest(event.request)
   
    return await new DistributionResponseProvider(this.activeSession).responseForDistribution(post.distrib_name)
  }

  isFilled(field: String): Boolean {
    return field.length != 0;
  }
}

