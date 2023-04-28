import { RouteEvents } from "../RouteEvents.js";
import { FetchEvent } from "../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../Interfaces/FetchEventHandler.js";
import { Database } from "../Services/Database.js";
import { BenificiarySpreadSheetRowsDeserializationService } from "../Services/BenificiarySpreadSheetRowsDeserializationService.js";

export class BeneficiaryDataUploadHandler implements FetchEventHandler {
  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.endsWith("/uploader");
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    try {
      const beneficiaries = await BenificiarySpreadSheetRowsDeserializationService.deserializeFormDataFromRequest(event.request)
      await beneficiaries.forEach(async (benificiary) => await Database.instance.addBenificiary(benificiary))
      ;
    } catch(error) {
      console.log("something went wrong " + error);
      return fetch(RouteEvents.home);
    }
    return fetch(RouteEvents.home);
  }
}
