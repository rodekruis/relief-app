import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { BeneficiaryCodeInputMethodPost } from "../../Models/BeneficiaryCodeInputMethodPost.js";
import { RouteEvents } from "../../RouteEvents.js";
import { DeserialisationService } from "../DeserialisationService.js";
import { ResponseTools } from "../ResponseTools.js";

export class SelectBenificiaryCodeInputMethodHandler implements FetchEventHandler {
    canHandleEvent(event: FetchEvent): boolean {
      return event.request.url.endsWith(RouteEvents.selectBenificiaryCodeInputMethod);
    }
  
    async handleEvent(event: FetchEvent): Promise<Response> {
      try {
        const post: BeneficiaryCodeInputMethodPost = await DeserialisationService.deserializeFormDataFromRequest(event.request)
        return ResponseTools.wrapInHtmlTemplate(this.templatepageForInputMethod(post.input_method))
      } catch(error) {
        console.error(error)
        return fetch(RouteEvents.home)
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