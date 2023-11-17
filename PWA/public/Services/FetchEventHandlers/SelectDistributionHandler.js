import { RouteEvents } from "../RouteEvents.js";
import { ResponseTools } from "../Services/ResponseTools.js";
import { Database } from "../Services/Database.js";
import { DeserialisationService } from "../Services/DeserialisationService.js";
import { BenificiaryInfoService } from "../Services/BenificiaryInfoService.js";
export class SelectDistributionRequestHandler {
    canHandleEvent(event) {
        return event.request.url.endsWith(RouteEvents.postSelectDistribution);
    }
    async handleEvent(event) {
        const post = await DeserialisationService.deserializeFormDataFromRequest(event.request);
        const selectedDistribution = (await Database.instance.distributionsWithName(post.distrib_name))[0];
        return await ResponseTools.replaceTemplateKeysWithValues(await fetch(RouteEvents.distributionsHome), {
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
