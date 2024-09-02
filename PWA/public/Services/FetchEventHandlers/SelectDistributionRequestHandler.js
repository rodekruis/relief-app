import { RouteEvents } from "../../RouteEvents.js";
import { ResponseTools } from "../ResponseTools.js";
import { DeserialisationService } from "../DeserialisationService.js";
import { BeneficiaryInfoService } from "../BeneficiaryInfoService.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
export class SelectDistributionRequestHandler extends ActiveSessionContainer {
    constructor() {
        super(...arguments);
        this.benificiaryInfoService = new BeneficiaryInfoService(this.activeSession.database);
    }
    canHandleEvent(event) {
        return event.request.url.endsWith(RouteEvents.postSelectDistribution);
    }
    async handleEvent(event) {
        const post = await DeserialisationService.deserializeFormDataFromRequest(event.request);
        const selectedDistribution = (await this.activeSession.database.distributionWithName(post.distrib_name));
        if (selectedDistribution) {
            this.activeSession.nameOfLastViewedDistribution = selectedDistribution.distrib_name;
            return await ResponseTools.replaceTemplateKeysWithValues(await ResponseTools.wrapInHtmlTemplate(RouteEvents.distributionsHome), {
                "distrib_name": selectedDistribution.distrib_name,
                "distrib_place": selectedDistribution.distrib_place,
                "distrib_date": selectedDistribution.distrib_date,
                beneficiary_info: await this.benificiaryInfoService.beneficiaryInfoTextFromDistribution(selectedDistribution)
            });
        }
        else {
            console.error("Expected distribution named " + post.distrib_name + " to exist in database");
            return fetch(RouteEvents.home);
        }
    }
    isFilled(field) {
        return field.length != 0;
    }
}
