import { BeneficiaryDataUploadHandler } from "./FetchEventHandlers/BeneficiaryDataUploadHandler.js";
import { ChooseBenificiaryCodeInputMethodPageHandler } from "./FetchEventHandlers/ChooseBenificiaryCodeInputMethodPageHandler.js";
import { CreateDistributionRequestHandler } from "./FetchEventHandlers/CreateDistributionRequestHandler.js";
import { DeleteDistributionPostHandler } from "./FetchEventHandlers/DeleteDistributionPostHandler.js";
import { FetchEventHandlers } from "./FetchEventHandlers/FetchEventHandlers.js";
import { ListDistributionRequestHandler } from "./FetchEventHandlers/ListDistributionRequestHandler.js";
import { NameDistributionRequestHandler } from "./FetchEventHandlers/NameDistributionRequestHandler.js";
import { SelectBenificiaryCodeInputMethodHandler } from "./FetchEventHandlers/SelectBenificiaryCodeInputMethodHandler.js";
import { SelectDistributionRequestHandler } from "./FetchEventHandlers/SelectDistributionRequestHandler.js";
import { UploadDataHandler } from "./FetchEventHandlers/UploadDataHandler.js";
import { Beneficiary } from "../Models/Beneficiary.js";
import { DeleteDistributionPost } from "../Models/DeleteDistributionPost.js";
import { Distribution } from "../Models/Distribution.js";
import { SelectDistributionPost } from "../Models/SelectDistributionPost.js";
import { RouteEvents } from "../RouteEvents.js";
import { BenificiaryInfoService } from "./BenificiaryInfoService.js";
import { Database } from "./Database.js";
import { DeserialisationService } from "./DeserialisationService.js";
import { FormParser } from "./FormParser.js";
import { BeneficiaryCodePostHandler } from "./FetchEventHandlers/BeneficiaryCodePostHandler.js";
import { BeneficiaryCodeInputMethodPost } from "../Models/BeneficiaryCodeInputMethodPost.js";
import { ActiveSession } from "./ActiveSession.js";
import { BeneficiaryEligilityService } from "./BeneficiaryEligilityService.js";
import { ViewDistributionDataHandler } from "./FetchEventHandlers/ViewDistributionDataHandler.js";
import { BeneficiariesService } from "./BeneficiariesService.js";
import { CheckWhosMissingPageHandler } from "./FetchEventHandlers/CheckWhosMissingPagehandler.js";
// Provides all the files that have to be cached for offline use
export class CacheFilePathService {
    pathsOfFilesToCache() {
        return [
            this.imagesPaths(),
            this.pagePaths(),
            this.modelPaths(),
            this.toplevelScriptsPaths(),
            this.fetchEventHanderPaths(),
            this.interfacesPaths(),
            this.externalLibrariesPaths(),
            this.servicePaths(),
        ].reduce((previousArray, currentValue) => {
            return previousArray.concat(currentValue);
        }, []);
    }
    pagePaths() {
        return [
            RouteEvents.template,
            RouteEvents.home,
            RouteEvents.distributionsHome,
            RouteEvents.nameDistribution,
            RouteEvents.listDistributions,
            RouteEvents.listDistributionsEmptyState,
            RouteEvents.deleteDistribution,
            RouteEvents.uploadData,
            RouteEvents.uploadDataError,
            RouteEvents.chooseBenificiaryCodeInputMethodPage,
            RouteEvents.codeInputUsingCamera,
            RouteEvents.codeinputUsingTextField,
            RouteEvents.codeInputFound,
            RouteEvents.codeInputNotFound,
            RouteEvents.viewData
        ];
    }
    toplevelScriptsPaths() {
        return this.pathsForTypesInFolder("", [
            "app",
            "sw",
            "navbar-burger",
            RouteEvents.name,
        ]);
    }
    externalLibrariesPaths() {
        return this.pathsForTypesInFolder("ExternalLibraries", [
            "mustache",
            "xlsx.full.min",
        ]).concat([
            "/ExternalLibraries/bulma.css",
            "/ExternalLibraries/zxing.js",
        ]);
    }
    imagesPaths() {
        return this.pathsForTypesInFolder("images", [
            "ReliefBox-horizontal-nobackground.png",
            "510logo.jpg",
            "ReliefBox-horizontal.png",
            "ReliefBox.PNG",
        ], "");
    }
    modelPaths() {
        return this.pathsForTypesInFolder("Models", [
            Beneficiary.name,
            Distribution.name,
            DeleteDistributionPost.name,
            SelectDistributionPost.name,
            BeneficiaryCodeInputMethodPost.name,
        ]);
    }
    servicePaths() {
        return this.pathsForTypesInFolder("Services", [
            BenificiaryInfoService.name,
            CacheFilePathService.name,
            Database.name,
            DeserialisationService.name,
            FormParser.name,
            BeneficiaryEligilityService.name,
            ActiveSession.name,
            BeneficiariesService.name
        ]);
    }
    fetchEventHanderPaths() {
        return this.pathsForTypesInFolder("Services/FetchEventHandlers", [
            BeneficiaryDataUploadHandler.name,
            CreateDistributionRequestHandler.name,
            DeleteDistributionPostHandler.name,
            FetchEventHandlers.name,
            ListDistributionRequestHandler.name,
            NameDistributionRequestHandler.name,
            SelectDistributionRequestHandler.name,
            UploadDataHandler.name,
            ChooseBenificiaryCodeInputMethodPageHandler.name,
            SelectBenificiaryCodeInputMethodHandler.name,
            BeneficiaryCodePostHandler.name,
            ViewDistributionDataHandler.name,
            CheckWhosMissingPageHandler.name
        ]);
    }
    interfacesPaths() {
        return this.pathsForTypesInFolder("Interfaces", [
            "FetchEvent",
            "FetchEventHandler",
        ]);
    }
    pathsForTypesInFolder(folder, typeNames, extension = ".js") {
        return typeNames.map((name) => this.pathForTypeInFolder(name, folder, extension));
    }
    pathForTypeInFolder(typeName, folder, extension = ".js") {
        let path = "/";
        if (folder.length > 0) {
            path += folder + "/";
        }
        path += typeName + extension;
        return path;
    }
}
