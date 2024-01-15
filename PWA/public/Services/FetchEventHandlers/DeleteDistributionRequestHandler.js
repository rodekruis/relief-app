import { RouteEvents } from "../../RouteEvents.js";
import { Distribution } from "../../Models/Distribution.js";
import { ResponseTools } from "../ResponseTools.js";
import { ActiveSessionContainer } from "./BeneficiaryCodePostHandler.js";
export class DeleteDistributionRequestHandler extends ActiveSessionContainer {
    canHandleEvent(event) {
        return event.request.url.endsWith(RouteEvents.deleteDistribution);
    }
    async handleEvent(event) {
        try {
            const distributions = await this.activeSession.database.readDistributions();
            return ResponseTools.replaceTemplateKeysWithValues(await ResponseTools.wrapInHtmlTemplate(fetch(RouteEvents.deleteDistribution)), {
                columns: Distribution.colums,
                rows: distributions
            });
        }
        catch {
            console.log("something went wrong");
        }
        return fetch(RouteEvents.home);
    }
}
