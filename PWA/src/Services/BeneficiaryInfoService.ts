import { Beneficiary } from "../Models/Beneficiary.js"
import { Distribution } from "../Models/Distribution.js"
import { Database } from "./Database.js"

export class BeneficiaryInfoService {
    database: Database
    
    constructor(database: Database) {
      this.database = database
    }

    async beneficiaryInfoTextFromDistribution(distribution: Distribution): Promise<string> {
      const beneficiaries: Beneficiary[] = await this.database.beneficiariesForDistributionNamed(distribution.distrib_name)
      const numberOfServedBeneficiaries = beneficiaries.filter(beneficiary => beneficiary.hasBeenMarkedAsReceived).length
      return this.beneficiaryInfoTextFromNumberOfBeneficiariesAndNumberServed(beneficiaries.length, numberOfServedBeneficiaries)
    }

    beneficiaryInfoTextFromNumberOfBeneficiariesAndNumberServed(numberOfBeneficiaries: number, numberOfServedBeneficiaries: number) {
      if(numberOfBeneficiaries > 0) {
        return "Beneficiaries served: " + numberOfServedBeneficiaries +" / " + numberOfBeneficiaries 
     } else {
       return "No beneficiary data found"
     }
    }
  }