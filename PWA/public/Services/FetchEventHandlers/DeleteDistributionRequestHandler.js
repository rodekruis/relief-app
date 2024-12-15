import { RouteEvents } from "../../RouteEvents.js";
import { Distribution } from "../../Models/Distribution.js";
import { ResponseTools } from "../ResponseTools.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
export class DeleteDistributionRequestHandler extends ActiveSessionContainer {
    canHandleEvent(event) {
        return event.request.url.endsWith(RouteEvents.deleteDistribution);
    }
    async handleEvent(event) {
        try {
            const distributions = await this.activeSession.database.readDistributions();
            if (distributions.length > 0) {
                return ResponseTools.wrapInHTPLTemplateAndReplaceKeysWithValues(RouteEvents.deleteDistribution, {
                    columns: Distribution.colums,
                    rows: distributions
                });
            }
            else {
                return ResponseTools.wrapInHtmlTemplate(RouteEvents.listDistributionsEmptyState);
            }
        }
        catch (error) {
            console.error(error);
        }
        return await ResponseTools.fetchFromCacheWithRemoteAsFallBack(RouteEvents.home);
    }
}
