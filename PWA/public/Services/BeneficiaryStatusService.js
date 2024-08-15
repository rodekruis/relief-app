import { ActiveSessionContainer } from "./ActiveSession.js";
export class BeneficiaryStatusService extends ActiveSessionContainer {
    async generateBeneficiariyStatusses() {
        var _a;
        if (this.activeSession.nameOfLastViewedDistribution) {
            var beneficiariesWithStatus = [];
            const currentDistribution = await this.activeSession.database.distributionWithName(this.activeSession.nameOfLastViewedDistribution);
            if (currentDistribution) {
                const distributionBeneficiaries = await this.activeSession.database.benificiariesForDistribution(currentDistribution);
                for (let i = 0; i < distributionBeneficiaries.length; i++) {
                    const currentDistributionBeneficiary = distributionBeneficiaries[i];
                    const currentBeneficiary = await this.activeSession.database.beneficiaryWithCode(currentDistributionBeneficiary.beneficiaryCode);
                    if (currentBeneficiary) {
                        let currentBeneficaryWithStatus = {};
                        currentBeneficaryWithStatus["code"] = currentBeneficiary.code;
                        for (let j = 1; j < currentBeneficiary.columns.length; j++) {
                            currentBeneficaryWithStatus[currentBeneficiary.columns[j]] = currentBeneficiary.values[j];
                        }
                        currentBeneficaryWithStatus["Recepient"] = currentDistributionBeneficiary.hasBeenMarkedAsReceived ? "Yes" : "No";
                        currentBeneficaryWithStatus["Received_when"] = (_a = currentDistributionBeneficiary.dateReceived) !== null && _a !== void 0 ? _a : "None";
                        beneficiariesWithStatus.push(currentBeneficaryWithStatus);
                    }
                    else {
                        throw new Error('Expected beneficiary for code ' + currentDistributionBeneficiary.beneficiaryCode);
                    }
                }
                return beneficiariesWithStatus;
            }
            else {
                throw new Error('Expected distribution');
            }
        }
        else {
            throw new Error('Expected active distribution');
        }
    }
}
