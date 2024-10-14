import { RouteEvents } from "../../RouteEvents.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
export class DownloadSpreadsheetTemplateHandler extends ActiveSessionContainer {
    canHandleEvent(event) {
        return event.request.url.includes(RouteEvents.downloadSpreadsheetTemplate);
    }
    async handleEvent(event) {
        const fileName = "data_template.xlsx";
        const templateResponse = await caches.match(fileName);
        if (templateResponse) {
            const updatedResponse = new Response(templateResponse.body, {
                status: templateResponse.status,
                statusText: templateResponse.statusText,
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition': 'attachment; filename="data_processed.xlsx"'
                },
            });
            return updatedResponse;
        }
        else {
            return Promise.reject(Error("Expected cached file named " + fileName));
        }
    }
}
