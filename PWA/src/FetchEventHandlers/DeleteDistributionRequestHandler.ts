import { RouteEvents } from "../RouteEvents.js";
import { FetchEvent } from "../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../Interfaces/FetchEventHandler.js";
import { Distribution } from "../Models/Distribution.js";
import { ResponseTools } from "../Services/ResponseTools.js";
import { Database } from "../Services/Database.js";

export class DeleteDistributionRequestHandler implements FetchEventHandler {
  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.endsWith(RouteEvents.deleteDistribution);
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    try {
      const distributions: [Distribution] = await Database.instance.readDistributions()
      console.log(distributions)
      return ResponseTools.replaceTemplateKeysWithValues(
        await fetch(RouteEvents.deleteDistribution), { 
        columns: Distribution.colums,
        rows: distributions
      })
    } catch {
      console.log("something went wrong")
    }
    return fetch(RouteEvents.home)
  }
}
