import { RouteEvents } from "../../RouteEvents";
import { ActiveSessionContainer } from "../ActiveSession";
import { BeneficiaryInfoService } from "../BeneficiaryInfoService";
import { ResponseTools } from "../ResponseTools";
export class DistributionResponseProvider extends ActiveSessionContainer {
    constructor() {
        super(...arguments);
        this.beneficiaryInfoService = new BeneficiaryInfoService(this.activeSession.database);
    }
    async responseForDistribution(distributionName) {
        const selectedDistribution = (await this.activeSession.database.distributionWithName(distributionName));
        if (selectedDistribution) {
            this.activeSession.nameOfLastViewedDistribution = selectedDistribution.distrib_name;
            return await ResponseTools.replaceTemplateKeysWithValues(await ResponseTools.wrapInHtmlTemplate(RouteEvents.distributionsHome), {
                "distrib_name": selectedDistribution.distrib_name,
                "distrib_place": selectedDistribution.distrib_place,
                "distrib_date": selectedDistribution.distrib_date,
                beneficiary_info: await this.beneficiaryInfoService.beneficiaryInfoTextFromDistribution(selectedDistribution)
            });
        }
        else {
            console.error("Expected distribution named " + distributionName + " to exist in database");
            return await ResponseTools.fetchFromCacheWithRemoteAsFallBack(RouteEvents.home);
        }
    }
}
