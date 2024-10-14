import { RouteEvents } from "../../RouteEvents.js";
import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
import { SpreadSheetService } from "../SpreadSheetService.js";
import { BeneficiaryStatusService } from "../BeneficiaryStatusService.js";

export class DownloadSpreadsheetTemplateHandler extends ActiveSessionContainer implements FetchEventHandler {
  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.includes(RouteEvents.downloadSpreadsheetTemplate);
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    try {
      const templateJson = [
        { "code": 4680490, "first name": "Aric", "last name": "Norwood" },
        { "code": 4535835, "first name": "Lira", "last name": "Calloway" },
        { "code": 9155570, "first name": "Daven", "last name": "Morrell" },
      ]

      return new Response(await SpreadSheetService.fileFromJson(templateJson), {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="data_processed.xlsx"'
        }
      });
    } catch(error) {
      return Promise.reject(error);
    }
  }
}