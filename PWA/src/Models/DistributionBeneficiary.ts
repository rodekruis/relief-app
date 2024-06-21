export class DistributionBeneficiary {
  beneficiaryCode: string;
  distributionName: string;
  hasBeenMarkedAsReceived: boolean;

  constructor(beneficiaryCode: string, distributionName: string, hasBeenMarkedAsReceived: boolean = false) {
    this.beneficiaryCode = beneficiaryCode;
    this.distributionName = distributionName;
    this.hasBeenMarkedAsReceived = hasBeenMarkedAsReceived
  }
}
