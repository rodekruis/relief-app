export class BenificiaryInfoService {
    constructor(database) {
        this.database = database;
    }
    async benificiaryInfoTextFromDistribution(distribution) {
        const benificiaries = await this.database.benificiariesForDistribution(distribution);
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
