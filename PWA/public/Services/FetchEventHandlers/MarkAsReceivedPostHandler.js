import { RouteEvents } from "../../RouteEvents.js";
import { ResponseTools } from "../ResponseTools.js";
export class ActiveSessionContainer {
    constructor(activeSession) {
        this.activeSession = activeSession;
    }
}
export class MarkAsReceivedPostHandler extends ActiveSessionContainer {
    canHandleEvent(event) {
        return event.request.url.includes(RouteEvents.received);
    }
    async handleEvent(event) {
        const body = event.request.body;
        const beneficiaryCode = this.beneficiaryCodeFromRequest(event.request);
        const activeDistributionName = this.activeSession.nameOfLastViewedDistribution;
        if (beneficiaryCode) {
            if (activeDistributionName) {
                try {
                    await this.activeSession.database.markBeneficiaryAsReceived(beneficiaryCode, activeDistributionName);
                }
                catch (error) {
                    console.error(error);
                }
            }
            else {
                console.error("Expected active distribution");
            }
        }
        else {
            console.error("Expected benificiarycode");
        }
        //TODO should be non camera when coming from non camera
        return ResponseTools.wrapInHtmlTemplate(RouteEvents.codeInputUsingCamera);
    }
    beneficiaryCodeFromRequest(request) {
        var _a;
        const url = new URL(request.referrer);
        const searchParams = url.searchParams;
        console.log(searchParams);
        return (_a = url.searchParams.get('code')) !== null && _a !== void 0 ? _a : undefined;
    }
}
