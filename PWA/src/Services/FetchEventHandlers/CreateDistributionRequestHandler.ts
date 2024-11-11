import { RouteEvents } from "../../RouteEvents.js";
import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { Distribution } from "../../Models/Distribution.js";
import { ResponseTools } from "../ResponseTools.js";
import { DeserialisationService } from "../DeserialisationService.js";
import { BeneficiaryInfoService } from "../BeneficiaryInfoService.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
import { DateService } from "../DateService.js";

export class CreateDistributionRequestHandler extends ActiveSessionContainer implements FetchEventHandler {
  beneficiaryInfoService = new BeneficiaryInfoService(this.activeSession.database)

  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.endsWith(RouteEvents.postCreateDistribution);
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    const distribution: Distribution = await DeserialisationService.deserializeFormDataFromRequest(event.request)

    if (
      !this.isFilled(distribution.distrib_name) ||
      !this.isFilled(distribution.distrib_place) ||
      !this.isFilled(distribution.distrib_date)
    ) {
      return ResponseTools.wrapInHTPLTemplateAndReplaceKeysWithValues(
        RouteEvents.nameDistribution, 
        { 
          errorMessages: ["Specify the name, location and date of the distribution."],
          todaysDateString: DateService.todaysDateString()
        }
      )
    } else {
      const existingDistribution = await this.activeSession.database.distributionWithName(distribution.distrib_name)

      if(existingDistribution) {
        return ResponseTools.wrapInHTPLTemplateAndReplaceKeysWithValues(
          RouteEvents.nameDistribution, 
          { 
            errorMessages: ["Distribution " + distribution.distrib_name + " already exists."],
            todaysDateString: DateService.todaysDateString()
          }
        )
      } else {
        try {
          await this.activeSession.database.addDistribution(distribution)
          this.activeSession.nameOfLastViewedDistribution = distribution.distrib_name
          return await ResponseTools.replaceTemplateKeysWithValues(
            await ResponseTools.wrapInHtmlTemplate(RouteEvents.distributionsHome), {
              "distrib_name": distribution.distrib_name,
              "distrib_place": distribution.distrib_place,
              "distrib_date": distribution.distrib_date,
              beneficiary_info: await this.beneficiaryInfoService.beneficiaryInfoTextFromDistribution(distribution),
              "isBeneficiaryListEmpty": true
            }
          )
        } catch(error) {
          console.error(error)
          return await ResponseTools.fetchFromCacheWithRemoteAsFallBack(RouteEvents.home)
        }
      }
    }
  }

  isFilled(field: String): Boolean {
    return field.length != 0;
  }
}