import { RouteEvents } from "../../RouteEvents.js";
import { Distribution } from "../../Models/Distribution.js";
import { ResponseTools } from "../ResponseTools.js";
import { ActiveSessionContainer } from "./BeneficiaryCodePostHandler.js";
export class ListDistributionRequestHandler extends ActiveSessionContainer {
    canHandleEvent(event) {
        const url = event.request.url;
        return url.endsWith(RouteEvents.listDistributions) || url.endsWith(RouteEvents.listDistributionsFormAction);
    }
    async handleEvent(event) {
        try {
            const distributions = await this.activeSession.database.readDistributions();
            console.log(distributions);
            return ResponseTools.replaceTemplateKeysWithValues(await fetch(RouteEvents.listDistributions), {
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
