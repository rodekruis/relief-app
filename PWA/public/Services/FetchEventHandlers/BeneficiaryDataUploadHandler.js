import { RouteEvents } from "../../RouteEvents.js";
import { BeneficiaryDeserializationService } from "../BeneficiaryDeserializationService.js";
import { ActiveSessionContainer } from "./BeneficiaryCodePostHandler.js";
import { ResponseTools } from "../ResponseTools.js";
import { BenificiaryInfoService } from "../BenificiaryInfoService.js";
export class BeneficiaryDataUploadHandler extends ActiveSessionContainer {
    canHandleEvent(event) {
        return event.request.url.endsWith("/uploader");
    }
    async handleEvent(event) {
        try {
            const beneficiaries = await new BeneficiaryDeserializationService().deserializeFormDataFromRequest(event.request);
            const database = this.activeSession.database;
            const distributionName = this.activeSession.nameOfLastViewedDistribution;
            if (distributionName) {
                const distribution = await database.distributionWithName(distributionName);
                if (distribution) {
                    await beneficiaries.forEach(async (beneficiary) => await database.addBenificiary(beneficiary));
                    await beneficiaries.forEach(async (beneficiary) => await database.addBeneficiaryToDistribution(beneficiary, distribution));
                    this.activeSession.nameOfLastViewedDistribution = distributionName;
                    const benificiaryInfoService = new BenificiaryInfoService(this.activeSession.database);
                    return await ResponseTools.replaceTemplateKeysWithValues(await ResponseTools.wrapInHtmlTemplate(RouteEvents.distributionsHome), {
                        "distrib_name": distribution.distrib_name,
                        "distrib_place": distribution.distrib_place,
                        "distrib_date": distribution.distrib_date,
                        beneficiary_info: await benificiaryInfoService.benificiaryInfoTextFromDistribution(distribution)
                    });
                }
                else {
                    throw "Expeced distribution named " + distributionName;
                }
            }
            else {
                throw "Expected active distribution";
            }
        }
        catch (error) {
            console.error(error);
            return fetch(RouteEvents.home);
        }
    }
}
