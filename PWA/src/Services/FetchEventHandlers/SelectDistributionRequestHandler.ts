import { RouteEvents } from "../../RouteEvents.js";
import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { SelectDistributionPost } from "../../Models/SelectDistributionPost.js";
import { ResponseTools } from "../ResponseTools.js";
import { DeserialisationService } from "../DeserialisationService.js";
import { BenificiaryInfoService } from "../BenificiaryInfoService.js";
import { ActiveSessionContainer } from "./BeneficiaryCodePostHandler.js";

export class SelectDistributionRequestHandler extends ActiveSessionContainer implements FetchEventHandler {
  benificiaryInfoService = new BenificiaryInfoService(this.activeSession.database)

  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.endsWith(RouteEvents.postSelectDistribution);
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    const post: SelectDistributionPost = await DeserialisationService.deserializeFormDataFromRequest(event.request)
    const selectedDistribution = (await this.activeSession.database.distributionWithName(post.distrib_name))
    if(selectedDistribution) {
      this.activeSession.nameOfLastViewedDistribution = selectedDistribution.distrib_name

      return await ResponseTools.replaceTemplateKeysWithValues(
        await ResponseTools.wrapInHtmlTemplate(RouteEvents.distributionsHome), {
          "distrib_name": selectedDistribution.distrib_name,
          "distrib_place": selectedDistribution.distrib_place,
          "distrib_date": selectedDistribution.distrib_date,
          beneficiary_info: await this.benificiaryInfoService.benificiaryInfoTextFromDistribution(selectedDistribution)
        }
      )
    } else {
      console.error("Expected distribution named " + post.distrib_name + " to exist in database")
      return fetch(RouteEvents.home)
    }
  }

  isFilled(field: String): Boolean {
    return field.length != 0;
  }
}