
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
        return Promise.reject(new Error("Expected active distribution"))
      }
    } else {
      return Promise.reject(new Error("Expected benificiarycode"))
    }

    if(this.activeSession.nameOfLastUsedDistributionInputMethod) {
      return ResponseTools.wrapInHtmlTemplate(
        this.templatepageForInputMethod(this.activeSession.nameOfLastUsedDistributionInputMethod)
      )
    } else {
      return Promise.reject(new Error("Expected nameOfLastUsedDistributionInputMethod"))
    }
  }

  private beneficiaryCodeFromRequest(request: Request): string | undefined {
    const url = new URL(request.referrer)
    const searchParams = url.searchParams
    console.log(searchParams)
    return url.searchParams.get('code') ?? undefined
  }

  private templatepageForInputMethod(inputMethod: string): string {
    this.activeSession.nameOfLastUsedDistributionInputMethod = inputMethod
    if(inputMethod == "video") {
      this.activeSession.nameOfLastUsedDistributionInputMethod = inputMethod
      return RouteEvents.codeInputUsingCamera
    } else if(inputMethod == "text") {
      this.activeSession.nameOfLastUsedDistributionInputMethod = inputMethod
      return RouteEvents.codeinputUsingTextField
    } else {
      throw "Unexpected input method: " + inputMethod
    }
  }
}