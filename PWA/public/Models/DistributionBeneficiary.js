export class DistributionBeneficiary {
    constructor(beneficiaryCode, distributionName, hasBeenMarkedAsReceived = false, dateReceived = undefined) {
        this.beneficiaryCode = beneficiaryCode;
        this.distributionName = distributionName;
        this.hasBeenMarkedAsReceived = hasBeenMarkedAsReceived;
        this.dateReceived = dateReceived;
    }
}
