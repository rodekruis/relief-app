export class BeneficiaryInfoService {
    constructor(database) {
        this.database = database;
    }
    async beneficiaryInfoTextFromDistribution(distribution) {
        const beneficiaries = await this.database.benificiariesForDistribution(distribution);
        const numberOfServedBeneficiaries = beneficiaries.filter(beneficiary => beneficiary.hasBeenMarkedAsReceived).length;
        return this.beneficiaryInfoTextFromNumberOfBeneficiariesAndNumberServed(beneficiaries.length, numberOfServedBeneficiaries);
    }
    beneficiaryInfoTextFromNumberOfBeneficiariesAndNumberServed(numberOfBeneficiaries, numberOfServedBeneficiaries) {
        if (numberOfBeneficiaries > 0) {
            return "Beneficiaries served: " + numberOfServedBeneficiaries + " / " + numberOfBeneficiaries;
        }
        else {
            return "No beneficiary data found";
        }
    }
}
