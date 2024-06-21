
import { RouteEvents } from "../../RouteEvents.js";
import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { ResponseTools } from "../ResponseTools.js";
import { ActiveSession } from "../ActiveSession.js";

export class ActiveSessionContainer {
    activeSession: ActiveSession;
    
    constructor(activeSession: ActiveSession) {
        this.activeSession = activeSession;
    }
}

export class MarkAsReceivedPostHandler extends ActiveSessionContainer implements FetchEventHandler {

  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.includes(RouteEvents.received);
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    const body = event.request.body
    
    const beneficiaryCode = this.beneficiaryCodeFromRequest(event.request)
    const activeDistributionName = this.activeSession.nameOfLastViewedDistribution
    if (beneficiaryCode) {
      if(activeDistributionName) {
        try {
          await this.activeSession.database.markBeneficiaryAsReceived(beneficiaryCode, activeDistributionName)
        } catch (error) {
          console.error(error)
        }
      } else {
        console.error("Expected active distribution")
      }
    } else {
      console.error("Expected benificiarycode")
    }
    //TODO check to what place we actually have to go to
    return ResponseTools.wrapInHtmlTemplate(RouteEvents.home)
  }

  private beneficiaryCodeFromRequest(request: Request): string | undefined {
    const url = new URL(request.referrer)
    const searchParams = url.searchParams
    console.log(searchParams)
    return url.searchParams.get('code') ?? undefined
  }
}