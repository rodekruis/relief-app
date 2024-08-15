import { ActiveSessionContainer } from "./ActiveSession.js"


export class BeneficiaryStatusService extends ActiveSessionContainer {
    async generateBeneficiariyStatusses(): Promise<Object[]> {
      if(this.activeSession.nameOfLastViewedDistribution) {
        var beneficiariesWithStatus: any[] = []
        const currentDistribution = await this.activeSession.database.distributionWithName(this.activeSession.nameOfLastViewedDistribution)
        if(currentDistribution) {
          const distributionBeneficiaries = await this.activeSession.database.benificiariesForDistribution(currentDistribution)
          for (let i = 0; i < distributionBeneficiaries.length; i++) {
            const currentDistributionBeneficiary = distributionBeneficiaries[i]
            const currentBeneficiary = await this.activeSession.database.beneficiaryWithCode(currentDistributionBeneficiary.beneficiaryCode)
            if(currentBeneficiary) {
              let currentBeneficaryWithStatus: any = {}
    
              currentBeneficaryWithStatus["code"] = currentBeneficiary.code
              for(let j=1; j <currentBeneficiary.columns.length; j++) {
                currentBeneficaryWithStatus[currentBeneficiary.columns[j]] = currentBeneficiary.values[j]
              }
              currentBeneficaryWithStatus["Recepient"] = currentDistributionBeneficiary.hasBeenMarkedAsReceived ? "Yes" : "No"
              currentBeneficaryWithStatus["Received_when"] = currentDistributionBeneficiary.dateReceived ?? "None"
  
              beneficiariesWithStatus.push(currentBeneficaryWithStatus)
            } else {
              throw new Error('Expected beneficiary for code ' + currentDistributionBeneficiary.beneficiaryCode)
            }
          }
    
          return beneficiariesWithStatus
        } else {
          throw new Error('Expected distribution')
        }
      } else {
        throw new Error('Expected active distribution')
      }
    }
  }