import { RouteEvents } from "../RouteEvents.js";
import { FetchEvent } from "../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../Interfaces/FetchEventHandler.js";
import { Distribution } from "../Models/Distribution.js";
import { ResponseTools } from "../Services/ResponseTools.js";
import { Database, ObjectStoreName } from "../Services/Database.js";

export class ListDistributionRequestHandler implements FetchEventHandler {
  canHandleEvent(event: FetchEvent): boolean {
    const url = event.request.url
    return url.endsWith(RouteEvents.listDistributions) || url.endsWith(RouteEvents.listDistributionsFormAction)
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    try {
      const distributions: [Distribution] = await Database.instance.readDistributions()
      console.log(distributions)
      return ResponseTools.replaceTemplateKeysWithValues(
        await fetch(RouteEvents.listDistributions), { 
        columns: Distribution.colums,
        rows: distributions
      })
    } catch {
      console.log("something went wrong")
    }
    return fetch(RouteEvents.home)
  }
}
