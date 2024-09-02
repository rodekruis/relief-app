import { RouteEvents } from "../../RouteEvents.js";
import { ResponseTools } from "../ResponseTools.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
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
                return Promise.reject(new Error("Expected active distribution"));
            }
        }
        else {
            return Promise.reject(new Error("Expected benificiarycode"));
        }
        if (this.activeSession.nameOfLastUsedDistributionInputMethod) {
            return ResponseTools.wrapInHtmlTemplate(this.templatepageForInputMethod(this.activeSession.nameOfLastUsedDistributionInputMethod));
        }
        else {
            return Promise.reject(new Error("Expected nameOfLastUsedDistributionInputMethod"));
        }
    }
    beneficiaryCodeFromRequest(request) {
        var _a;
        const url = new URL(request.referrer);
        const searchParams = url.searchParams;
        console.log(searchParams);
        return (_a = url.searchParams.get('code')) !== null && _a !== void 0 ? _a : undefined;
    }
    templatepageForInputMethod(inputMethod) {
        this.activeSession.nameOfLastUsedDistributionInputMethod = inputMethod;
        if (inputMethod == "video") {
            this.activeSession.nameOfLastUsedDistributionInputMethod = inputMethod;
            return RouteEvents.codeInputUsingCamera;
        }
        else if (inputMethod == "text") {
            this.activeSession.nameOfLastUsedDistributionInputMethod = inputMethod;
            return RouteEvents.codeinputUsingTextField;
        }
        else {
            throw "Unexpected input method: " + inputMethod;
        }
    }
}
