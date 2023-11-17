import { RouteEvents } from "../../RouteEvents.js";
import { Database } from "../Database.js";
import { BenificiarySpreadSheetRowsDeserializationService } from "../BenificiarySpreadSheetRowsDeserializationService.js";
export class BeneficiaryDataUploadHandler {
    canHandleEvent(event) {
        return event.request.url.endsWith("/uploader");
    }
    async handleEvent(event) {
        try {
            const beneficiaries = await BenificiarySpreadSheetRowsDeserializationService.deserializeFormDataFromRequest(event.request);
            await beneficiaries.forEach(async (benificiary) => await Database.instance.addBenificiary(benificiary));
        }
        catch (error) {
            console.log("something went wrong " + error);
            return fetch(RouteEvents.home);
        }
        return fetch(RouteEvents.home);
    }
}
