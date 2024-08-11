import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { BeneficiaryCodeInputMethodPost } from "../../Models/BeneficiaryCodeInputMethodPost.js";
import { RouteEvents } from "../../RouteEvents.js";
import { DeserialisationService } from "../DeserialisationService.js";
import { ResponseTools } from "../ResponseTools.js";

export class ContinueDistributionHandler implements FetchEventHandler {
    canHandleEvent(event: FetchEvent): boolean {
      return event.request.url.includes(RouteEvents.continueDistribution)
    }
  
    async handleEvent(event: FetchEvent): Promise<Response> {
      //TODO this should be context aware
      return await ResponseTools.wrapInHtmlTemplate(this.templatepageForInputMethod("text"))
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