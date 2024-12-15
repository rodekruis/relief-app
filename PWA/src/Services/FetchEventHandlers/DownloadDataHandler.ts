import { RouteEvents } from "../../RouteEvents.js";
import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
import { SpreadSheetService } from "../SpreadSheetService.js";
import { BeneficiaryStatusService } from "../BeneficiaryStatusService.js";

export class DownloadDataHandler extends ActiveSessionContainer implements FetchEventHandler {
  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.includes(RouteEvents.downloadData);
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    try {
      const beneficiaryStatusService = new BeneficiaryStatusService(this.activeSession)
      return new Response(await SpreadSheetService.fileFromJson(await beneficiaryStatusService.generateBeneficiariyStatusses()), {
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