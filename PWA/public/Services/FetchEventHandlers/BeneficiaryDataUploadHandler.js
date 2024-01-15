import { RouteEvents } from "../../RouteEvents.js";
import { BenificiarySpreadSheetRowsDeserializationService } from "../BenificiarySpreadSheetRowsDeserializationService.js";
import { ActiveSessionContainer } from "./BeneficiaryCodePostHandler.js";
export class BeneficiaryDataUploadHandler extends ActiveSessionContainer {
    canHandleEvent(event) {
        return event.request.url.endsWith("/uploader");
    }
    async handleEvent(event) {
        try {
            const beneficiaries = await BenificiarySpreadSheetRowsDeserializationService.deserializeFormDataFromRequest(event.request);
            await beneficiaries.forEach(async (benificiary) => await this.activeSession.database.addBenificiary(benificiary));
        }
        catch (error) {
            console.log("something went wrong " + error);
            return fetch(RouteEvents.home);
        }
        return fetch(RouteEvents.home);
    }
}
