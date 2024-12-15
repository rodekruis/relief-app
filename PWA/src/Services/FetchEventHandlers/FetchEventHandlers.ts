import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { CreateDistributionRequestHandler } from "./CreateDistributionRequestHandler.js";
import { NameDistributionRequestHandler } from "./NameDistributionRequestHandler.js";
import { ListDistributionRequestHandler } from "./ListDistributionRequestHandler.js";
import { SelectDistributionRequestHandler } from "./SelectDistributionRequestHandler.js";
import { DeleteDistributionRequestHandler } from "./DeleteDistributionRequestHandler.js";
import { UploadDataHandler } from "./UploadDataHandler.js";
import { BeneficiaryDataUploadHandler } from "./BeneficiaryDataUploadHandler.js"
import { DeleteDistributionPostHandler } from "./DeleteDistributionPostHandler.js";
import { ChooseBeneficiaryCodeInputMethodPageHandler } from "./ChooseBeneficiaryCodeInputMethodPageHandler.js";
import { SelectBeneficiaryCodeInputMethodHandler } from "./SelectBeneficiaryCodeInputMethodHandler.js";
import { ViewDistributionDataHandler } from "./ViewDistributionDataHandler.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
import { BeneficiaryCodePostHandler } from "./BeneficiaryCodePostHandler.js";
import { CheckWhoIsMissingPageHandler } from "./CheckWhoIsMissingPageHandler.js";
import { MarkAsReceivedPostHandler } from "./MarkAsReceivedPostHandler.js";
import { HomepageHandler } from "./HomepageHandler.js";
import { ContinueDistributionHandler } from "./ContinueDistributionHandler.js";
import { DownloadDataHandler } from "./DownloadDataHandler.js";
import { DownloadSpreadsheetTemplateHandler } from "./DownloadSpreadsheetTemplateHandler.js";
import { DeleteDistributionsConfirmHandler } from "./DeleteDistributionsConfirmHandler.js";
import { DistributionsHandler } from "./DistributionsHandler.js";
import { DocumentationHandler } from "./DocumentationHandler.js";

export class FetchEventHandlers extends ActiveSessionContainer implements FetchEventHandler {
  all: FetchEventHandler[] = [
    new CreateDistributionRequestHandler(this.activeSession),
    new NameDistributionRequestHandler(),
    new ListDistributionRequestHandler(this.activeSession),
    new SelectDistributionRequestHandler(this.activeSession),
    new DeleteDistributionRequestHandler(this.activeSession),
    new DeleteDistributionPostHandler(this.activeSession),
    new UploadDataHandler(),
    new BeneficiaryDataUploadHandler(this.activeSession),
    new ChooseBeneficiaryCodeInputMethodPageHandler(),
    new SelectBeneficiaryCodeInputMethodHandler(this.activeSession),
    new BeneficiaryCodePostHandler(this.activeSession),
    new ViewDistributionDataHandler(this.activeSession),
    new CheckWhoIsMissingPageHandler(this.activeSession),
    new MarkAsReceivedPostHandler(this.activeSession),
    new HomepageHandler(this.activeSession),
    new ContinueDistributionHandler(this.activeSession),
    new DownloadDataHandler(this.activeSession),
    new DownloadSpreadsheetTemplateHandler(),
    new DeleteDistributionsConfirmHandler(),
    new DistributionsHandler(),
    new DocumentationHandler()
  ];

  handlersForEvent(event: FetchEvent): FetchEventHandler[] {
    return this.all.filter((handler) => handler.canHandleEvent(event));
  }

  canHandleEvent(event: FetchEvent): boolean {
    return this.handlersForEvent(event).length > 0;
  }

  handleEvent(event: FetchEvent): Promise<Response | undefined> {
    const handler = this.handlersForEvent(event)?.[0]
    console.info("ℹ️ Will handle " + event.request.url + " with " + handler.constructor.name)
    return handler.handleEvent(event);
  }
}
