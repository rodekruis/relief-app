import { ActiveSessionContainer } from "./ActiveSession.js";
export class BeneficiariesService extends ActiveSessionContainer {
    async beneficiariesForActiveDistribution() {
        const database = this.activeSession.database;
        const activeDistributionName = this.activeSession.nameOfLastViewedDistribution;
        if (activeDistributionName) {
            const distribution = await database.distributionWithName(activeDistributionName);
            if (distribution) {
                const beneficiaries = await database.beneficiariesForDistributionNamed(activeDistributionName);
                return beneficiaries;
            }
            else {
                throw "Expected distribution";
            }
        }
        else {
            throw "Expected active distribution name";
        }
    }
    isBeneficiaryEligible(beneficiary) {
        return beneficiary.hasBeenMarkedAsReceived == false;
    }
    async eligibleBeneficiariesForActiveDistribution() {
        const allDistributionBenificiaries = await this.beneficiariesForActiveDistribution();
        let eligibleBeneficiaries = [];
        for (let i = 0; i < allDistributionBenificiaries.length; i++) {
            const current = allDistributionBenificiaries[i];
            if (this.isBeneficiaryEligible(current)) {
                eligibleBeneficiaries.push(current);
            }
        }
        return eligibleBeneficiaries;
    }
}
