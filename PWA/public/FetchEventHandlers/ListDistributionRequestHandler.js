import { RouteEvents } from "../RouteEvents.js";
import { Distribution } from "../Models/Distribution.js";
import { ResponseTools } from "../Services/ResponseTools.js";
import { Database } from "../Services/Database.js";
export class ListDistributionRequestHandler {
    canHandleEvent(event) {
        const url = event.request.url;
        return url.endsWith(RouteEvents.listDistributions) || url.endsWith(RouteEvents.listDistributionsFormAction);
    }
    async handleEvent(event) {
        try {
            const distributions = await Database.instance.readDistributions();
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
