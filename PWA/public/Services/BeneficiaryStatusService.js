import { ActiveSessionContainer } from "./ActiveSession.js";
export class BeneficiaryStatusService extends ActiveSessionContainer {
    async generateBeneficiariyStatusses() {
        var _a;
        if (this.activeSession.nameOfLastViewedDistribution) {
            var beneficiariesWithStatus = [];
            const currentDistribution = await this.activeSession.database.distributionWithName(this.activeSession.nameOfLastViewedDistribution);
            if (currentDistribution) {
                const beneficiaries = await this.activeSession.database.beneficiariesForDistributionNamed(currentDistribution.distrib_name);
                for (let i = 0; i < beneficiaries.length; i++) {
                    const currentBeneficiary = beneficiaries[i];
                    let currentBeneficaryWithStatus = {};
                    currentBeneficaryWithStatus["code"] = currentBeneficiary.code;
                    for (let j = 1; j < currentBeneficiary.columns.length; j++) {
                        currentBeneficaryWithStatus[currentBeneficiary.columns[j]] = currentBeneficiary.values[j];
                    }
                    currentBeneficaryWithStatus["Recepient"] = currentBeneficiary.hasBeenMarkedAsReceived ? "Yes" : "No";
                    currentBeneficaryWithStatus["Received_when"] = (_a = currentBeneficiary.dateReceived) !== null && _a !== void 0 ? _a : "None";
                    beneficiariesWithStatus.push(currentBeneficaryWithStatus);
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
