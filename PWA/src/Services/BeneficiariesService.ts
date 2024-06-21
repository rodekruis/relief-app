import { Beneficiary } from "../Models/Beneficiary.js";
import { DistributionBeneficiary } from "../Models/DistributionBeneficiary.js";
import { ActiveSessionContainer } from "./ActiveSession.js";

export class BeneficiariesService extends ActiveSessionContainer {
    async beneficiariesForActiveDistribution(): Promise<Beneficiary[]> {
      const database = this.activeSession.database;
      const activeDistributionName = this.activeSession.nameOfLastViewedDistribution
  
        if (activeDistributionName) {
          const distribution = await database.distributionWithName(activeDistributionName);
          if (distribution) {
            const activeDistributionBeneficiaries = await this.distributionBenificiariesForActiveDistribution()
            
            const activeDistributionBeneficiaryCodes = activeDistributionBeneficiaries
                .map((distributionBeneficiary) => {
                    return distributionBeneficiary.beneficiaryCode
                })

            const allBeneficiaries = await database.readBeneficiaries()
            const beneficiaries = allBeneficiaries
                .filter((beneficiary) => {
                    return activeDistributionBeneficiaryCodes.indexOf(beneficiary.code) != -1
                })
  
                console.log("ℹ️")
                console.log(allBeneficiaries)
                console.log(beneficiaries)

            return beneficiaries;
          } else {
            throw "Expected distribution";
          }
        } else {
          throw "Expected active distribution name";
        }
    }

    async distributionBenificiariesForActiveDistribution(): Promise<DistributionBeneficiary[]> {
      const database = this.activeSession.database;
      const activeDistributionName = this.activeSession.nameOfLastViewedDistribution
      if (activeDistributionName) {
        const distribution = await database.distributionWithName(activeDistributionName);
        if (distribution) {
          const activeDistributionBeneficiaries = (
            await database.benificiariesForDistribution(distribution)
          ).filter((distributionBeneficiary) => {
            return distributionBeneficiary.distributionName === activeDistributionName;
          })
          return activeDistributionBeneficiaries
        } else {
          throw "Expected distribution"
        }
      } else {
        throw "Expected active distributionName"
      }
    }

    async isBeneficiaryEligible(beneficiary: DistributionBeneficiary): Promise<boolean> {
      const activeDistributionBeneficiaries = await this.distributionBenificiariesForActiveDistribution()
      var isEligible = false

      activeDistributionBeneficiaries.forEach(element => {
        if(element.beneficiaryCode == beneficiary.beneficiaryCode) {
          isEligible = element.hasBeenMarkedAsReceived == false
        }
      });

      return isEligible
    }

    async eligibleBeneficiariesForActiveDistribution(): Promise<Beneficiary[]> {
      const allDistributionBenificiaries = await this.distributionBenificiariesForActiveDistribution()
      
      let eligibleDistributionBeneficiaries: DistributionBeneficiary[] = []
      for (let i = 0; i < allDistributionBenificiaries.length; i++) {
        const current = allDistributionBenificiaries[i]
        if(current.hasBeenMarkedAsReceived == false) {
          eligibleDistributionBeneficiaries.push(current)
        }
      }

      let eligibleBeneficiaries: Beneficiary[] = []
      for (let i = 0; i < eligibleDistributionBeneficiaries.length; i++) {
        const current = eligibleDistributionBeneficiaries[i]
        const currentBeneficiary = await this.activeSession.database.beneficiaryWithCode(current.beneficiaryCode)
        if(currentBeneficiary) {
          eligibleBeneficiaries.push(currentBeneficiary)
        }
      }

      return eligibleBeneficiaries
    }
  }