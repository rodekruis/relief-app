import { RouteEvents } from "../../RouteEvents.js";
import { BeneficiaryDeserializationService } from "../BeneficiaryDeserializationService.js";
import { ActiveSessionContainer } from "./BeneficiaryCodePostHandler.js";
export class BeneficiaryDataUploadHandler extends ActiveSessionContainer {
    canHandleEvent(event) {
        return event.request.url.endsWith("/uploader");
    }
    async handleEvent(event) {
        try {
            const beneficiaries = await new BeneficiaryDeserializationService().deserializeFormDataFromRequest(event.request);
            await beneficiaries.forEach(async (beneficiary) => await this.activeSession.database.addBenificiary(beneficiary));
        }
        catch (error) {
            console.log("something went wrong " + error);
            return fetch(RouteEvents.home);
        }
        return fetch(RouteEvents.home);
    }
}
