import { BeneficiaryDataUploadHandler } from "./FetchEventHandlers/BeneficiaryDataUploadHandler.js";
import { ChooseBeneficiaryCodeInputMethodPageHandler } from "./FetchEventHandlers/ChooseBeneficiaryCodeInputMethodPageHandler.js";
import { CreateDistributionRequestHandler } from "./FetchEventHandlers/CreateDistributionRequestHandler.js";
import { DeleteDistributionPostHandler } from "./FetchEventHandlers/DeleteDistributionPostHandler.js";
import { FetchEventHandlers } from "./FetchEventHandlers/FetchEventHandlers.js";
import { ListDistributionRequestHandler } from "./FetchEventHandlers/ListDistributionRequestHandler.js";
import { NameDistributionRequestHandler } from "./FetchEventHandlers/NameDistributionRequestHandler.js";
import { SelectBeneficiaryCodeInputMethodHandler } from "./FetchEventHandlers/SelectBeneficiaryCodeInputMethodHandler.js";
import { SelectDistributionRequestHandler } from "./FetchEventHandlers/SelectDistributionRequestHandler.js";
import { UploadDataHandler } from "./FetchEventHandlers/UploadDataHandler.js";
import { Beneficiary } from "../Models/Beneficiary.js";
import { DeleteDistributionPost } from "../Models/DeleteDistributionPost.js";
import { Distribution } from "../Models/Distribution.js";
import { SelectDistributionPost } from "../Models/SelectDistributionPost.js";
import { RouteEvents } from "../RouteEvents.js";
import { BeneficiaryInfoService } from "./BeneficiaryInfoService.js";
import { Database } from "./Database.js";
import { DeserialisationService } from "./DeserialisationService.js";
import { FormParser } from "./FormParser.js";
import { BeneficiaryCodePostHandler } from "./FetchEventHandlers/BeneficiaryCodePostHandler.js";
import { BeneficiaryCodeInputMethodPost } from "../Models/BeneficiaryCodeInputMethodPost.js";
import { ActiveSession } from "./ActiveSession.js";
import { ViewDistributionDataHandler } from "./FetchEventHandlers/ViewDistributionDataHandler.js";
import { BeneficiariesService } from "./BeneficiariesService.js";
import { CheckWhoIsMissingPageHandler } from "./FetchEventHandlers/CheckWhoIsMissingPageHandler.js";
import { MarkAsReceivedPostHandler } from "./FetchEventHandlers/MarkAsReceivedPostHandler.js";
import { HomepageHandler } from "./FetchEventHandlers/HomepageHandler.js";
import { DateService } from "./DateService.js";
import { ContinueDistributionHandler } from "./FetchEventHandlers/ContinueDistributionHandler.js";
import { DownloadDataHandler } from "./FetchEventHandlers/DownloadDataHandler.js";
import { BeneficiaryStatusService } from "./BeneficiaryStatusService.js";
import { DownloadSpreadsheetTemplateHandler } from "./FetchEventHandlers/DownloadSpreadsheetTemplateHandler.js";
import { DeleteDistributionsConfirmHandler } from "./FetchEventHandlers/DeleteDistributionsConfirmHandler.js";
import { DistributionResponseProvider } from "./DistributionResponseProvider.js";
import { DistributionsHandler } from "./FetchEventHandlers/DistributionsHandler.js";
import { DocumentationHandler } from "./FetchEventHandlers/DocumentationHandler.js";
// Provides all the files that have to be cached for offline use
export class CacheFilePathService {
    pathsOfFilesToCache() {
        return [
            this.miscellaneousPaths(),
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
    miscellaneousPaths() {
        return [
            "/",
            "/favicon.ico",
            "/manifest.json",
            "/apple-touch-icon.png",
            "/apple-touch-icon-precomposed.png",
            "/images/icons/app-icon-192x192.png",
            "/apple-touch-icon-120x120.png",
            "/apple-touch-icon-120x120-precomposed.png",
        ];
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
            RouteEvents.chooseBeneficiaryCodeInputMethodPage,
            RouteEvents.codeInputUsingCamera,
            RouteEvents.codeinputUsingTextField,
            RouteEvents.codeInputFound,
            RouteEvents.codeInputNotFound,
            RouteEvents.viewData,
            RouteEvents.noBeneficiariesFound,
            RouteEvents.confirmDistributionDeletion,
            RouteEvents.documentation
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
            BeneficiaryInfoService.name,
            CacheFilePathService.name,
            Database.name,
            DeserialisationService.name,
            FormParser.name,
            ActiveSession.name,
            BeneficiariesService.name,
            DateService.name,
            BeneficiaryStatusService.name,
            DistributionResponseProvider.name
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
            ChooseBeneficiaryCodeInputMethodPageHandler.name,
            SelectBeneficiaryCodeInputMethodHandler.name,
            BeneficiaryCodePostHandler.name,
            ViewDistributionDataHandler.name,
            CheckWhoIsMissingPageHandler.name,
            MarkAsReceivedPostHandler.name,
            HomepageHandler.name,
            ContinueDistributionHandler.name,
            DownloadDataHandler.name,
            DownloadSpreadsheetTemplateHandler.name,
            DeleteDistributionsConfirmHandler.name,
            DistributionsHandler.name,
            DocumentationHandler.name
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
