import { Beneficiary } from "../Models/Beneficiary.js"
import { Distribution } from "../Models/Distribution.js"
import { DistributionBeneficiary } from "../Models/DistributionBeneficiary.js"
import { Database } from "./Database.js"

export class BenificiaryInfoService {
    database: Database
    
    constructor(database: Database) {
      this.database = database
    }

    async benificiaryInfoTextFromDistribution(distribution: Distribution): Promise<string> {
      const benificiaries: DistributionBeneficiary[] = await this.database.benificiariesForDistribution(distribution)
      const numberOfServedBenificiaries = 42 //TODO: implement proper calculation
      if(benificiaries.length > 0) {
        //Beneficiaries served: {{ number_recipients }} / {{ number_beneficiaries }}
         return "Beneficiaries served: " + numberOfServedBenificiaries  
      } else {
        return "No beneficiary data found"
      }
    }
  }