import { Beneficiary } from "../Models/Beneficiary.js"
import { Distribution } from "../Models/Distribution.js"
import { DistributionBeneficiary } from "../Models/DistributionBeneficiary.js"
import { Database } from "./Database.js"

export class BeneficiaryInfoService {
    database: Database
    
    constructor(database: Database) {
      this.database = database
    }

    async beneficiaryInfoTextFromDistribution(distribution: Distribution): Promise<string> {
      const beneficiaries: DistributionBeneficiary[] = await this.database.benificiariesForDistribution(distribution)
      const numberOfServedBeneficiaries = beneficiaries.filter(beneficiary => beneficiary.hasBeenMarkedAsReceived).length
      if(beneficiaries.length > 0) {
         return "Beneficiaries served: " + numberOfServedBeneficiaries +" / " + beneficiaries.length 
      } else {
        return "No beneficiary data found"
      }
    }
  }