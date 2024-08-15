export class DistributionBeneficiary {
  beneficiaryCode: string;
  distributionName: string;
  hasBeenMarkedAsReceived: boolean;
  dateReceived?: string

  constructor(
    beneficiaryCode: string,
    distributionName: string, 
    hasBeenMarkedAsReceived: boolean = false,
    dateReceived: (string | undefined) = undefined
  ) {
    this.beneficiaryCode = beneficiaryCode;
    this.distributionName = distributionName;
    this.hasBeenMarkedAsReceived = hasBeenMarkedAsReceived
    this.dateReceived = dateReceived
  }
}
