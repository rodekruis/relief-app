import { RouteEvents } from "../RouteEvents.js";
import { FetchEvent } from "../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../Interfaces/FetchEventHandler.js";
import { Distribution } from "../Models/Distribution.js";
import { ResponseTools } from "../Services/ResponseTools.js";
import { Database } from "../Services/Database.js";
import { DeserialisationService } from "../Services/DeserialisationService.js";
import { BenificiaryInfoService } from "../Services/BenificiaryInfoService.js";

export class CreateDistributionRequestHandler implements FetchEventHandler {
  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.endsWith(RouteEvents.postCreateDistribution);
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    const distribution: Distribution = await DeserialisationService.deserializeFormDataFromRequest(event.request)

    try {
      await Database.instance.addDistribution(distribution)
    } catch {
      console.log("something went wrong")
    }
    
    if (
      !this.isFilled(distribution.distrib_name) ||
      !this.isFilled(distribution.distrib_place) ||
      !this.isFilled(distribution.distrib_date)
    ) {
      return ResponseTools.replaceTemplateKeysWithValues(
        await caches.match(RouteEvents.nameDistribution) as Response,
        { errorMessages: ["Specify the name, location and date of the distribution."] }
      )
    } else {
      return await ResponseTools.replaceTemplateKeysWithValues(
        await fetch(RouteEvents.distributionsHome), {
          "distrib_name": distribution.distrib_name,
          "distrib_place": distribution.distrib_place,
          "distrib_date": distribution.distrib_date,
          beneficiary_info: await BenificiaryInfoService.benificiaryInfoTextFromDistribution(distribution)
        }
      )
    }
  }

  isFilled(field: String): Boolean {
    return field.length != 0;
  }
}