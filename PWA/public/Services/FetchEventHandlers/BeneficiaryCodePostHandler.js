import { RouteEvents } from "../../RouteEvents.js";
import { ResponseTools } from "../ResponseTools.js";
import { BeneficiaryEligilityService } from "../BeneficiaryEligilityService.js";
export class ActiveSessionContainer {
    constructor(activeSession) {
        this.activeSession = activeSession;
    }
}
export class BeneficiaryCodePostHandler extends ActiveSessionContainer {
    constructor() {
        super(...arguments);
        this.eligebilityService = new BeneficiaryEligilityService(this.activeSession);
    }
    canHandleEvent(event) {
        return event.request.url.includes(RouteEvents.checkBenificiaryCodeInputMethod);
    }
    async handleEvent(event) {
        if (await this.eligebilityService.isBenificiaryEligibleForCurrentDistribution(this.beneficiaryCodeFromRequest(event.request))) {
            return ResponseTools.wrapInHtmlTemplate(RouteEvents.codeInputNotFound);
        }
        else {
            return ResponseTools.wrapInHtmlTemplate(RouteEvents.codeInputNotFound);
        }
    }
    beneficiaryCodeFromRequest(request) {
        var _a;
        const url = new URL(request.url);
        return (_a = url.searchParams.get('code')) !== null && _a !== void 0 ? _a : undefined;
    }
}
