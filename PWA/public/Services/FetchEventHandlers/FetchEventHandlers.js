import { CreateDistributionRequestHandler } from "./CreateDistributionRequestHandler.js";
import { NameDistributionRequestHandler } from "./NameDistributionRequestHandler.js";
import { ListDistributionRequestHandler } from "./ListDistributionRequestHandler.js";
import { SelectDistributionRequestHandler } from "./SelectDistributionRequestHandler.js";
import { DeleteDistributionRequestHandler } from "./DeleteDistributionRequestHandler.js";
import { UploadDataHandler } from "./UploadDataHandler.js";
import { BeneficiaryDataUploadHandler } from "./BeneficiaryDataUploadHandler.js";
import { DeleteDistributionPostHandler } from "./DeleteDistributionPostHandler.js";
import { ChooseBenificiaryCodeInputMethodPageHandler } from "./ChooseBenificiaryCodeInputMethodPageHandler.js";
import { SelectBenificiaryCodeInputMethodHandler } from "./SelectBenificiaryCodeInputMethodHandler.js";
import { ActiveSessionContainer, BeneficiaryCodePostHandler } from "./BeneficiaryCodePostHandler.js";
export class FetchEventHandlers extends ActiveSessionContainer {
    constructor() {
        super(...arguments);
        this.all = [
            new CreateDistributionRequestHandler(this.activeSession),
            new NameDistributionRequestHandler(),
            new ListDistributionRequestHandler(this.activeSession),
            new SelectDistributionRequestHandler(this.activeSession),
            new DeleteDistributionRequestHandler(this.activeSession),
            new DeleteDistributionPostHandler(this.activeSession),
            new UploadDataHandler(),
            new BeneficiaryDataUploadHandler(this.activeSession),
            new ChooseBenificiaryCodeInputMethodPageHandler(),
            new SelectBenificiaryCodeInputMethodHandler(),
            new BeneficiaryCodePostHandler(this.activeSession)
        ];
    }
    handlersForEvent(event) {
        return this.all.filter((handler) => handler.canHandleEvent(event));
    }
    canHandleEvent(event) {
        return this.handlersForEvent(event).length > 0;
    }
    handleEvent(event) {
        var _a;
        console.log("Will handle " + event.request.url);
        return (_a = this.handlersForEvent(event)) === null || _a === void 0 ? void 0 : _a[0].handleEvent(event);
    }
}
