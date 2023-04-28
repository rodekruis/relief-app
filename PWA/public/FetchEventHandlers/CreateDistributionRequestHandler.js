import { RouteEvents } from "../RouteEvents.js";
import { ResponseTools } from "../Services/ResponseTools.js";
import { Database } from "../Services/Database.js";
import { DeserialisationService } from "../Services/DeserialisationService.js";
import { BenificiaryInfoService } from "../Services/BenificiaryInfoService.js";
export class CreateDistributionRequestHandler {
    canHandleEvent(event) {
        return event.request.url.endsWith(RouteEvents.postCreateDistribution);
    }
    async handleEvent(event) {
        const distribution = await DeserialisationService.deserializeFormDataFromRequest(event.request);
        try {
            await Database.instance.addDistribution(distribution);
        }
        catch {
            console.log("something went wrong");
        }
        if (!this.isFilled(distribution.distrib_name) ||
            !this.isFilled(distribution.distrib_place) ||
            !this.isFilled(distribution.distrib_date)) {
            return ResponseTools.replaceTemplateKeysWithValues(await caches.match(RouteEvents.nameDistribution), { errorMessages: ["Specify the name, location and date of the distribution."] });
        }
        else {
            return await ResponseTools.replaceTemplateKeysWithValues(await fetch(RouteEvents.distributionsHome), {
                "distrib_name": distribution.distrib_name,
                "distrib_place": distribution.distrib_place,
                "distrib_date": distribution.distrib_date,
                beneficiary_info: await BenificiaryInfoService.benificiaryInfoTextFromDistribution(distribution)
            });
        }
    }
    isFilled(field) {
        return field.length != 0;
    }
}
