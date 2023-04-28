import { FetchEventHandler } from "../Interfaces/FetchEventHandler.js";
import { FetchEvent } from "../Interfaces/FetchEvent.js";
import { CreateDistributionRequestHandler } from "./CreateDistributionRequestHandler.js";
import { NameDistributionRequestHandler } from "./NameDistributionRequestHandler.js";
import { ListDistributionRequestHandler } from "./ListDistributionRequestHandler.js";
import { SelectDistributionRequestHandler } from "./SelectDistributionRequestHandler.js";
import { DeleteDistributionRequestHandler } from "./DeleteDistributionRequestHandler.js";
import { UploadDataHandler } from "./UploadDataHandler.js";
import { BeneficiaryDataUploadHandler } from "./BeneficiaryDataUploadHandler.js"
import { DeleteDistributionPostHandler } from "./DeleteDistributionPostHandler.js";
import { ChooseBenificiaryCodeInputMethodHandler } from "./ChooseBenificiaryCodeInputMethodHandler.js";

export class FetchEventHandlers implements FetchEventHandler {
  all: FetchEventHandler[] = [
    new CreateDistributionRequestHandler(),
    new NameDistributionRequestHandler(),
    new ListDistributionRequestHandler(),
    new SelectDistributionRequestHandler(),
    new DeleteDistributionRequestHandler(),
    new DeleteDistributionPostHandler(),
    new UploadDataHandler(),
    new BeneficiaryDataUploadHandler(),
    new ChooseBenificiaryCodeInputMethodHandler()
  ];

  handlersForEvent(event: FetchEvent): FetchEventHandler[] {
    return this.all.filter((handler) => handler.canHandleEvent(event));
  }

  canHandleEvent(event: FetchEvent): boolean {
    return this.handlersForEvent(event).length > 0;
  }

  handleEvent(event: FetchEvent): Promise<Response | undefined> {
    console.log("Will handle " + event.request.url)
    return this.handlersForEvent(event)?.[0].handleEvent(event);
  }
}
