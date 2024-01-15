import { RouteEvents } from "../../RouteEvents.js";
import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { Distribution } from "../../Models/Distribution.js";
import { ResponseTools } from "../ResponseTools.js";
import { Database } from "../Database.js";
import { ActiveSessionContainer } from "./BeneficiaryCodePostHandler.js";

export class DeleteDistributionRequestHandler extends ActiveSessionContainer implements FetchEventHandler {
  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.endsWith(RouteEvents.deleteDistribution);
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    try {
      const distributions: [Distribution] = await this.activeSession.database.readDistributions()      
      return ResponseTools.replaceTemplateKeysWithValues(
        await ResponseTools.wrapInHtmlTemplate(fetch(RouteEvents.deleteDistribution)), { 
        columns: Distribution.colums,
        rows: distributions
      })
    } catch {
      console.log("something went wrong")
    }
    return fetch(RouteEvents.home)
  }
}
