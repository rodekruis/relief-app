import { RouteEvents } from "../../RouteEvents.js";
import { ResponseTools } from "../ResponseTools.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
export class BeneficiaryCodePostHandler extends ActiveSessionContainer {
    canHandleEvent(event) {
        return event.request.url.includes(RouteEvents.checkBeneficiaryCodeInputMethod);
    }
    async handleEvent(event) {
        const beneficiaryCode = this.beneficiaryCodeFromRequest(event.request);
        if (beneficiaryCode) {
            if (this.activeSession.nameOfLastViewedDistribution) {
                const beneficiary = await this.activeSession.database.beneficiaryWithCode(beneficiaryCode, this.activeSession.nameOfLastViewedDistribution);
                if (beneficiary) {
                    return ResponseTools.wrapInHTPLTemplateAndReplaceKeysWithValues(RouteEvents.codeInputFound, {
                        eligibility_info_box_id: beneficiary.hasBeenMarkedAsReceived ? "noteligible" : "eligible",
                        eligibility_info_name: beneficiary.code,
                        eligibility_info_values: beneficiary.values,
                    });
                }
                else {
                    return ResponseTools.wrapInHtmlTemplate(RouteEvents.codeInputNotFound);
                }
            }
            else {
                console.error("Expected activeDistribution");
                return ResponseTools.wrapInHtmlTemplate(RouteEvents.codeInputNotFound);
            }
        }
        else {
            console.error("Failed to retrieve code from URL");
            return ResponseTools.wrapInHtmlTemplate(RouteEvents.codeInputNotFound);
        }
    }
    beneficiaryCodeFromRequest(request) {
        var _a;
        const url = new URL(request.url);
        return (_a = url.searchParams.get('code')) !== null && _a !== void 0 ? _a : undefined;
    }
}
