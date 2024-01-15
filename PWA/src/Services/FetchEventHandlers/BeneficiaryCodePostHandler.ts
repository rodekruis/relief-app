import { RouteEvents } from "../../RouteEvents.js";
import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { ResponseTools } from "../ResponseTools.js";
import { BeneficiaryEligilityService } from "../BeneficiaryEligilityService.js";
import { ActiveSession } from "../../SessionState/ActiveSession.js";

export class ActiveSessionContainer {
    activeSession: ActiveSession;
    
    constructor(activeSession: ActiveSession) {
        this.activeSession = activeSession;
    }
}

export class BeneficiaryCodePostHandler extends ActiveSessionContainer implements FetchEventHandler {
    eligebilityService = new BeneficiaryEligilityService(this.activeSession)

  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.includes(RouteEvents.checkBenificiaryCodeInputMethod);
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    if(await this.eligebilityService.isBenificiaryEligibleForCurrentDistribution(this.beneficiaryCodeFromRequest(event.request))) {
        return ResponseTools.wrapInHtmlTemplate(RouteEvents.codeInputNotFound)
    } else {
        return ResponseTools.wrapInHtmlTemplate(RouteEvents.codeInputNotFound)
    }
  }

  private beneficiaryCodeFromRequest(request: Request): string | undefined {
    const url = new URL(request.url)
    return url.searchParams.get('code') ?? undefined
  }
}