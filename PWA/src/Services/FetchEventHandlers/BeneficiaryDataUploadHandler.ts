import { RouteEvents } from "../../RouteEvents.js";
import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { BeneficiaryDeserializationService } from "../BeneficiaryDeserializationService.js";
import { ActiveSessionContainer } from "./BeneficiaryCodePostHandler.js";

export class BeneficiaryDataUploadHandler extends ActiveSessionContainer implements FetchEventHandler {
  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.endsWith("/uploader");
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    try {
      const beneficiaries = await new BeneficiaryDeserializationService().deserializeFormDataFromRequest(event.request)
      const database = this.activeSession.database
      const distributionName = this.activeSession.nameOfLastViewedDistribution
      if(distributionName) {
        const distribution = await database.distributionWithName(distributionName)
      if(distribution) {
        await beneficiaries.forEach(async (beneficiary) => await database.addBenificiary(beneficiary))
        await beneficiaries.forEach(async (beneficiary) => await database.addBeneficiaryToDistribution(beneficiary, distribution))
      } else {
        throw "Expeced distribution named " + distributionName
      }
      } else {
        throw "Expected active distribution"
      }
    } catch(error) {
      console.error(error)
      return fetch(RouteEvents.home);
    }
    return fetch(RouteEvents.home);
  }
}
