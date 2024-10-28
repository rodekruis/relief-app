import { RouteEvents } from "../../RouteEvents.js";
import { BeneficiaryDeserializationService } from "../BeneficiaryDeserializationService.js";
import { ResponseTools } from "../ResponseTools.js";
import { BeneficiaryInfoService } from "../BeneficiaryInfoService.js";
import { ActiveSessionContainer } from "../ActiveSession.js";
export class BeneficiaryDataUploadHandler extends ActiveSessionContainer {
    canHandleEvent(event) {
        return event.request.url.endsWith("/uploader");
    }
    async handleEvent(event) {
        try {
            const database = this.activeSession.database;
            const distributionName = this.activeSession.nameOfLastViewedDistribution;
            if (distributionName) {
                const distribution = await database.distributionWithName(distributionName);
                if (distribution) {
                    const beneficiaries = await new BeneficiaryDeserializationService().deserializeFormDataFromRequest(event.request, distributionName);
                    if (!this.areAllCodesUnique(beneficiaries)) {
                        throw "All beneficiary codes should be unique";
                    }
                    for (const beneficiary of beneficiaries) {
                        await database.addBeneficiary(beneficiary);
                    }
                    this.activeSession.nameOfLastViewedDistribution = distributionName;
                    const beneficiaryInfoService = new BeneficiaryInfoService(this.activeSession.database);
                    return await ResponseTools.wrapInHTPLTemplateAndReplaceKeysWithValues(RouteEvents.distributionsHome, {
                        "distrib_name": distribution.distrib_name,
                        "distrib_place": distribution.distrib_place,
                        "distrib_date": distribution.distrib_date,
                        beneficiary_info: await beneficiaryInfoService.beneficiaryInfoTextFromNumberOfBeneficiariesAndNumberServed(beneficiaries.length, 0)
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
            return ResponseTools.wrapInHtmlTemplate(RouteEvents.uploadDataError);
        }
    }
    areAllCodesUnique(beneficiaries) {
        const codes = new Set();
        for (const beneficiary of beneficiaries) {
            if (codes.has(beneficiary.code)) {
                return false;
            }
            codes.add(beneficiary.code);
        }
        return true;
    }
}
