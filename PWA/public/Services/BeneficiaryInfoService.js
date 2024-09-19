export class BeneficiaryInfoService {
    constructor(database) {
        this.database = database;
    }
    async beneficiaryInfoTextFromDistribution(distribution) {
        const beneficiaries = await this.database.benificiariesForDistribution(distribution);
        const numberOfServedBeneficiaries = beneficiaries.filter(beneficiary => beneficiary.hasBeenMarkedAsReceived).length;
        if (beneficiaries.length > 0) {
            return "Beneficiaries served: " + numberOfServedBeneficiaries + " / " + beneficiaries.length;
        }
        else {
            return "No beneficiary data found";
        }
    }
}
