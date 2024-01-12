import { RouteEvents } from "../../RouteEvents.js";
import { ResponseTools } from "../ResponseTools.js";
import { Database } from "../Database.js";
import { DeserialisationService } from "../DeserialisationService.js";
import { BenificiaryInfoService } from "../BenificiaryInfoService.js";
import { ActiveSession } from "../../SessionState/ActiveSession.js";
export class SelectDistributionRequestHandler {
    canHandleEvent(event) {
        return event.request.url.endsWith(RouteEvents.postSelectDistribution);
    }
    async handleEvent(event) {
        const post = await DeserialisationService.deserializeFormDataFromRequest(event.request);
        const selectedDistribution = (await Database.instance.distributionsWithName(post.distrib_name))[0];
        ActiveSession.singleton.nameOfLastViewedDistribution = selectedDistribution.distrib_name;
        return await ResponseTools.replaceTemplateKeysWithValues(await ResponseTools.wrapInHtmlTemplate(RouteEvents.distributionsHome), {
            "distrib_name": selectedDistribution.distrib_name,
            "distrib_place": selectedDistribution.distrib_place,
            "distrib_date": selectedDistribution.distrib_date,
            beneficiary_info: await BenificiaryInfoService.benificiaryInfoTextFromDistribution(selectedDistribution)
        });
    }
    isFilled(field) {
        return field.length != 0;
    }
}
