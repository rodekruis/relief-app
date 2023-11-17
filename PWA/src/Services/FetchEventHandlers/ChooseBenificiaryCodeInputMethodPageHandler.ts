import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { RouteEvents } from "../../RouteEvents.js";
import { ResponseTools } from "../ResponseTools.js";

export class ChooseBenificiaryCodeInputMethodPageHandler implements FetchEventHandler {
    canHandleEvent(event: FetchEvent): boolean {
      return event.request.url.endsWith(RouteEvents.chooseBenificiaryCodeInputMethod);
    }
  
    async handleEvent(event: FetchEvent): Promise<Response> {
        return ResponseTools.wrapInHtmlTemplate(RouteEvents.chooseBenificiaryCodeInputMethodPage)
    }
  }