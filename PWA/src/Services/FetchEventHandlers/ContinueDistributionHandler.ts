import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { RouteEvents } from "../../RouteEvents.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
import { ResponseTools } from "../ResponseTools.js";

export class ContinueDistributionHandler extends ActiveSessionContainer implements FetchEventHandler {
    canHandleEvent(event: FetchEvent): boolean {
      return event.request.url.includes(RouteEvents.continueDistribution)
    }
  
    async handleEvent(event: FetchEvent): Promise<Response> {
      if(this.activeSession.nameOfLastUsedDistributionInputMethod) {
        return await ResponseTools.wrapInHtmlTemplate(
          this.templatepageForInputMethod(this.activeSession.nameOfLastUsedDistributionInputMethod)
        )
      } else {
        throw "Expected nameOfLastUsedDistributionInputMethod"
      }
    }

    private templatepageForInputMethod(inputMethod: string): string {
      if(inputMethod == "video") {
        return RouteEvents.codeInputUsingCamera
      } else if(inputMethod == "text") {
        return RouteEvents.codeinputUsingTextField
      } else {
        throw "Unexpected input method: " + inputMethod
      }
    }
  }