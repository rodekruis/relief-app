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
      const benificiaries: DistributionBeneficiary[] = await this.database.benificiariesForDistribution(distribution)
      const numberOfServedBenificiaries = benificiaries.filter(benificiary => benificiary.hasBeenMarkedAsReceived).length
      if(benificiaries.length > 0) {
         return "Beneficiaries served: " + numberOfServedBenificiaries +" / " + benificiaries.length 
      } else {
        return "No beneficiary data found"
      }
    }
  }