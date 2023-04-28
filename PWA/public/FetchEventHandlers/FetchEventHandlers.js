import { CreateDistributionRequestHandler } from "./CreateDistributionRequestHandler.js";
import { NameDistributionRequestHandler } from "./NameDistributionRequestHandler.js";
import { ListDistributionRequestHandler } from "./ListDistributionRequestHandler.js";
import { SelectDistributionRequestHandler } from "./SelectDistributionRequestHandler.js";
import { DeleteDistributionRequestHandler } from "./DeleteDistributionRequestHandler.js";
import { UploadDataHandler } from "./UploadDataHandler.js";
import { BeneficiaryDataUploadHandler } from "./BeneficiaryDataUploadHandler.js";
import { DeleteDistributionPostHandler } from "./DeleteDistributionPostHandler.js";
import { ChooseBenificiaryCodeInputMethodHandler } from "./ChooseBenificiaryCodeInputMethodHandler.js";
export class FetchEventHandlers {
    constructor() {
        this.all = [
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
