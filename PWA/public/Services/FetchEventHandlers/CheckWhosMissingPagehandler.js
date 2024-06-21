import { RouteEvents } from "../../RouteEvents.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
import { BeneficiariesService } from "../BeneficiariesService.js";
import { ResponseTools } from "../ResponseTools.js";
export class CheckWhosMissingPageHandler extends ActiveSessionContainer {
    canHandleEvent(event) {
        return event.request.url.endsWith(RouteEvents.checkWhosMissing);
    }
    async handleEvent(event) {
        const beneficiariesService = new BeneficiariesService(this.activeSession);
        const beneficiaries = await beneficiariesService.eligibleBeneficiariesForActiveDistribution();
        console.log("Will display:");
        console.log(beneficiaries);
        return await ResponseTools.wrapInHTPLTemplateAndReplaceKeysWithValues(RouteEvents.viewData, {
            columns: this.columnsFromBeneficiaries(beneficiaries),
            beneficiaries: beneficiaries,
        });
    }
    columnsFromBeneficiaries(beneficiaries) {
        if (beneficiaries.length > 0) {
            return beneficiaries[0].columns;
        }
        else {
            return [];
        }
    }
}
