import { BenificiarySpreadSheetRow } from "../Models/BenificiarySpreadSheetRow.js";
export class BenificiaryInfoService {
    static async benificiaryInfoTextFromDistribution(distribution) {
        const benificiaries = [new BenificiarySpreadSheetRow("one, two")]; //await Database.instance.benificiariesForDistribution(distribution)
        const numberOfServedBenificiaries = 42; //TODO: implement proper calculation
        if (benificiaries.length > 0) {
            //Beneficiaries served: {{ number_recipients }} / {{ number_beneficiaries }}
            return "Beneficiaries served: " + numberOfServedBenificiaries;
        }
        else {
            return "No beneficiary data found";
        }
    }
}
