import { RouteEvents } from "../../RouteEvents.js";
import { ResponseTools } from "../ResponseTools.js";
import { DeserialisationService } from "../DeserialisationService.js";
import { BenificiaryInfoService } from "../BenificiaryInfoService.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
export class CreateDistributionRequestHandler extends ActiveSessionContainer {
    constructor() {
        super(...arguments);
        this.benificiaryInfoService = new BenificiaryInfoService(this.activeSession.database);
    }
    canHandleEvent(event) {
        return event.request.url.endsWith(RouteEvents.postCreateDistribution);
    }
    async handleEvent(event) {
        const distribution = await DeserialisationService.deserializeFormDataFromRequest(event.request);
        if (!this.isFilled(distribution.distrib_name) ||
            !this.isFilled(distribution.distrib_place) ||
            !this.isFilled(distribution.distrib_date)) {
            return ResponseTools.wrapInHTPLTemplateAndReplaceKeysWithValues(RouteEvents.nameDistribution, { errorMessages: ["Specify the name, location and date of the distribution."] });
        }
        else {
            try {
                await this.activeSession.database.addDistribution(distribution);
                this.activeSession.nameOfLastViewedDistribution = distribution.distrib_name;
                return await ResponseTools.replaceTemplateKeysWithValues(await ResponseTools.wrapInHtmlTemplate(RouteEvents.distributionsHome), {
                    "distrib_name": distribution.distrib_name,
                    "distrib_place": distribution.distrib_place,
                    "distrib_date": distribution.distrib_date,
                    beneficiary_info: await this.benificiaryInfoService.benificiaryInfoTextFromDistribution(distribution)
                });
            }
            catch (error) {
                console.error(error);
                return fetch(RouteEvents.home);
            }
        }
    }
    isFilled(field) {
        return field.length != 0;
    }
}
