export class BeneficiaryEligilityService {
    constructor(activeSession) {
        this.activeSession = activeSession;
    }
    async isBenificiaryEligibleForCurrentDistribution(beneficiaryCode) {
        const nameOfActiveDistribution = this.activeSession.nameOfLastViewedDistribution;
        if (nameOfActiveDistribution) {
            const distribution = await this.activeSession.database.distributionWithName(nameOfActiveDistribution);
            if (distribution) {
                const distributionBeneficiaries = await this.activeSession.database.benificiariesForDistribution(distribution);
                console.log("🦆 there is a distribution");
                console.log(distributionBeneficiaries);
                const matchedBeneficiaries = distributionBeneficiaries.filter((beneficiary) => {
                    return beneficiary.beneficiaryCode === beneficiaryCode;
                });
                if (matchedBeneficiaries.length == 1) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                console.error("Active distrution named " + nameOfActiveDistribution + " not found in database");
                return false;
            }
        }
        else {
            throw Error("Expected active distribution");
        }
        return false;
    }
}
