import { ActiveSessionContainer } from "./ActiveSession.js";
export class BeneficiariesService extends ActiveSessionContainer {
    async beneficiariesForActiveDistribution() {
        const database = this.activeSession.database;
        const activeDistributionName = this.activeSession.nameOfLastViewedDistribution;
        if (activeDistributionName) {
            const distribution = await database.distributionWithName(activeDistributionName);
            if (distribution) {
                const activeDistributionBeneficiaries = (await database.benificiariesForDistribution(distribution)).filter((distributionBeneficiary) => {
                    return distributionBeneficiary.distributionName === activeDistributionName;
                });
                const activeDistributionBeneficiaryCodes = activeDistributionBeneficiaries
                    .map((distributionBeneficiary) => {
                    return distributionBeneficiary.beneficiaryCode;
                });
                const allBeneficiaries = await database.readBeneficiaries();
                const beneficiaries = allBeneficiaries
                    .filter((beneficiary) => {
                    return activeDistributionBeneficiaryCodes.indexOf(beneficiary.code) != -1;
                });
                console.log("ℹ️");
                console.log(allBeneficiaries);
                console.log(beneficiaries);
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
}
