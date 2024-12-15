import { RouteEvents } from "../../RouteEvents.js";
import { ResponseTools } from "../ResponseTools.js";
export class NameDistributionRequestHandler {
    canHandleEvent(event) {
        return event.request.url.includes(RouteEvents.nameDistribution);
    }
    async handleEvent(event) {
        return ResponseTools.wrapInHTPLTemplateAndReplaceKeysWithValues(RouteEvents.nameDistribution, {
            errorMessages: [],
            todaysDateString: DateService.todaysDateString()
        });
    }
}
export class DateService {
    static todaysDateString() {
        var today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        let dateString = year + "-";
        if (month < 10)
            dateString += "0";
        dateString += month;
        dateString += "-";
        if (day < 10)
            dateString += "0";
        dateString += day;
        return dateString;
    }
}
