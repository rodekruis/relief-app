export class DistributionBeneficiary {
  beneficiaryCode: string;
  distributionName: string;

  constructor(beneficiaryCode: string, distributionName: string) {
    this.beneficiaryCode = beneficiaryCode;
    this.distributionName = distributionName;
  }
}
