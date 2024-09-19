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
import { BeneficiaryEligilityService } from "./BeneficiaryEligilityService.js";
import { ViewDistributionDataHandler } from "./FetchEventHandlers/ViewDistributionDataHandler.js";
import { BeneficiariesService } from "./BeneficiariesService.js";
import { CheckWhosMissingPageHandler } from "./FetchEventHandlers/CheckWhosMissingPageHandler.js";
import { MarkAsReceivedPostHandler } from "./FetchEventHandlers/MarkAsReceivedPostHandler.js";
import { HomepageHandler } from "./FetchEventHandlers/HomepageHandler.js";
import { DateService } from "./DateService.js";
import { ContinueDistributionHandler } from "./FetchEventHandlers/ContinueDistributionHandler.js";
import { DownloadDataHandler } from "./FetchEventHandlers/DownloadDataHandler.js";
import { BeneficiaryStatusService } from "./BeneficiaryStatusService.js";

// Provides all the files that have to be cached for offline use
export class CacheFilePathService {
  pathsOfFilesToCache(): string[] {
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

  private pagePaths(): string[] {
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
      RouteEvents.noBeneficiariesFound
    ];
  }

  private toplevelScriptsPaths(): string[] {
    return this.pathsForTypesInFolder("", [
      "app",
      "sw",
      "navbar-burger",
      RouteEvents.name,
    ]);
  }

  private externalLibrariesPaths(): string[] {
    return this.pathsForTypesInFolder("ExternalLibraries", [
      "mustache",
      "xlsx.full.min",
    ]).concat(
      [
        "/ExternalLibraries/bulma.css",
        "/ExternalLibraries/zxing.js",
      ]
    )
  }

  private imagesPaths(): string[] {
    return this.pathsForTypesInFolder(
      "images", [
      "ReliefBox-horizontal-nobackground.png",
      "510logo.jpg",
      "ReliefBox-horizontal.png",
      "ReliefBox.PNG",
    ], 
    ""
    );
  }

  private modelPaths(): string[] {
    return this.pathsForTypesInFolder("Models", [
      Beneficiary.name,
      Distribution.name,
      DeleteDistributionPost.name,
      SelectDistributionPost.name,
      BeneficiaryCodeInputMethodPost.name,
    ]);
  }

  private servicePaths(): string[] {
    return this.pathsForTypesInFolder("Services", [
      BeneficiaryInfoService.name,
      CacheFilePathService.name,
      Database.name,
      DeserialisationService.name,
      FormParser.name,
      BeneficiaryEligilityService.name,
      ActiveSession.name,
      BeneficiariesService.name,
      DateService.name,
      BeneficiaryStatusService.name
    ]);
  }

  private fetchEventHanderPaths(): string[] {
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
      CheckWhosMissingPageHandler.name,
      MarkAsReceivedPostHandler.name,
      HomepageHandler.name,
      ContinueDistributionHandler.name,
      DownloadDataHandler.name
    ]);
  }

  private interfacesPaths(): string[] {
    return this.pathsForTypesInFolder("Interfaces", [
      "FetchEvent",
      "FetchEventHandler",
    ]);
  }

  private pathsForTypesInFolder(
    folder: string,
    typeNames: String[],
    extension: string = ".js"
  ): string[] {
    return typeNames.map((name) =>
      this.pathForTypeInFolder(name, folder, extension)
    );
  }

  private pathForTypeInFolder(
    typeName: String,
    folder: string,
    extension: string = ".js"
  ): string {
    let path = "/";
    if (folder.length > 0) {
      path += folder + "/";
    }
    path += typeName + extension;

    return path;
  }
}
