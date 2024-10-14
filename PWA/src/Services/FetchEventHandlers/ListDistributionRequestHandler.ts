import { RouteEvents } from "../../RouteEvents.js";
import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { Distribution } from "../../Models/Distribution.js";
import { ResponseTools } from "../ResponseTools.js";
import { ActiveSessionContainer } from "../ActiveSession.js";

export class ListDistributionRequestHandler extends ActiveSessionContainer implements FetchEventHandler {
  canHandleEvent(event: FetchEvent): boolean {
    const url = event.request.url
    return url.endsWith(RouteEvents.listDistributions) || url.endsWith(RouteEvents.listDistributionsFormAction)
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    try {
      const distributions: Distribution[] = await this.activeSession.database.readDistributions()
      console.log(distributions)

      if(distributions.length > 0) {
        return ResponseTools.wrapInHTPLTemplateAndReplaceKeysWithValues(
          RouteEvents.listDistributions, { 
          columns: Distribution.colums,
          rows: distributions
        })
      } else {
        return ResponseTools.wrapInHtmlTemplate(
          RouteEvents.listDistributionsEmptyState
        )
      }      
    } catch {
      console.log("something went wrong")
    }
    return fetch(RouteEvents.home)
  }
}
