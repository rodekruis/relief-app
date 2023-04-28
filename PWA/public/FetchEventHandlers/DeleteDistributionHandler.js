import { RouteEvents } from "../RouteEvents.js";
import { Distribution } from "../Models/Distribution.js";
import { ResponseTools } from "../Services/ResponseTools.js";
import { Database } from "../Services/Database.js";
export class DeleteDistributionRequestHandler {
    canHandleEvent(event) {
        return event.request.url.endsWith(RouteEvents.deleteDistribution);
    }
    async handleEvent(event) {
        try {
            const distributions = await Database.instance.readDistributions();
            console.log(distributions);
            return ResponseTools.replaceTemplateKeysWithValues(await fetch(RouteEvents.deleteDistribution), {
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
