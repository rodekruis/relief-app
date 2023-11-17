import { RouteEvents } from "../../RouteEvents.js";
import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { SelectDistributionPost } from "../../Models/SelectDistributionPost.js";
import { ResponseTools } from "../ResponseTools.js";
import { Database } from "../Database.js";
import { DeserialisationService } from "../DeserialisationService.js";
import { BenificiaryInfoService } from "../BenificiaryInfoService.js";
import { ActiveSession } from "../ActiveSession.js";

export class SelectDistributionRequestHandler implements FetchEventHandler {
  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.endsWith(RouteEvents.postSelectDistribution);
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    const post: SelectDistributionPost = await DeserialisationService.deserializeFormDataFromRequest(event.request)
    const selectedDistribution = (await Database.instance.distributionsWithName(post.distrib_name))[0]

    ActiveSession.singleton.nameOfLastViewedDistribution = selectedDistribution.distrib_name

    return await ResponseTools.replaceTemplateKeysWithValues(
        await ResponseTools.wrapInHtmlTemplate(RouteEvents.distributionsHome), {
          "distrib_name": selectedDistribution.distrib_name,
          "distrib_place": selectedDistribution.distrib_place,
          "distrib_date": selectedDistribution.distrib_date,
          beneficiary_info: await BenificiaryInfoService.benificiaryInfoTextFromDistribution(selectedDistribution)
        }
      )
  }

  isFilled(field: String): Boolean {
    return field.length != 0;
  }
}