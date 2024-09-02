export class BeneficiaryInfoService {
    constructor(database) {
        this.database = database;
    }
    async beneficiaryInfoTextFromDistribution(distribution) {
        const benificiaries = await this.database.benificiariesForDistribution(distribution);
        const numberOfServedBenificiaries = benificiaries.filter(benificiary => benificiary.hasBeenMarkedAsReceived).length;
        if (benificiaries.length > 0) {
            return "Beneficiaries served: " + numberOfServedBenificiaries + " / " + benificiaries.length;
        }
        else {
            return "No beneficiary data found";
        }
    }
}
