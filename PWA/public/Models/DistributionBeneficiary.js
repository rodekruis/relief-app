export class DistributionBeneficiary {
    constructor(beneficiaryCode, distributionName, hasBeenMarkedAsReceived = false) {
        this.beneficiaryCode = beneficiaryCode;
        this.distributionName = distributionName;
        this.hasBeenMarkedAsReceived = hasBeenMarkedAsReceived;
    }
}
