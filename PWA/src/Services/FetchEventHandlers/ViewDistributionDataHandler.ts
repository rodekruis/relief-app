import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { Beneficiary } from "../../Models/Beneficiary.js";
import { RouteEvents } from "../../RouteEvents.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
import { BeneficiariesService } from "../BeneficiariesService.js";
import { ResponseTools } from "../ResponseTools.js";

export class ViewDistributionDataHandler
  extends ActiveSessionContainer
  implements FetchEventHandler
{
  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.endsWith("/view_data");
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    try {
      const beneficiariesService = new BeneficiariesService(this.activeSession);
      const beneficiaries: Beneficiary[] =
        await beneficiariesService.beneficiariesForActiveDistribution();

      console.log("Will display:");
      console.log(beneficiaries);

      if(beneficiaries.length > 0) {
        return await ResponseTools.wrapInHTPLTemplateAndReplaceKeysWithValues(
          RouteEvents.viewData,
          {
            columns: this.columnsFromBeneficiaries(beneficiaries),
            beneficiaries: beneficiaries,
          }
        );
      } else {
        return await ResponseTools.wrapInHtmlTemplate(RouteEvents.noBeneficiariesFound)
      }

    } catch (error) {
      console.error(error);
    }
    return fetch(RouteEvents.home);
  }

  private columnsFromBeneficiaries(beneficiaries: Beneficiary[]): string[] {
    if (beneficiaries.length > 0) {
      return beneficiaries[0].columns;
    } else {
      return [];
    }
  }
}
