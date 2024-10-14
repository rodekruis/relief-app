import { RouteEvents } from "../../RouteEvents.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
import { SpreadSheetService } from "../SpreadSheetService.js";
export class DownloadSpreadsheetTemplateHandler extends ActiveSessionContainer {
    canHandleEvent(event) {
        return event.request.url.includes(RouteEvents.downloadSpreadsheetTemplate);
    }
    async handleEvent(event) {
        try {
            const templateJson = [
                { "code": 4680490, "first name": "Aric", "last name": "Norwood" },
                { "code": 4535835, "first name": "Lira", "last name": "Calloway" },
                { "code": 9155570, "first name": "Daven", "last name": "Morrell" },
            ];
            return new Response(await SpreadSheetService.fileFromJson(templateJson), {
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition': 'attachment; filename="data_processed.xlsx"'
                }
            });
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
}
