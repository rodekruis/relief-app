import { Database } from "../Services/Database"

export class ActiveSession {
    nameOfLastViewedDistribution?: string
    database: Database
  
    constructor(database: Database) {
      this.database = database
    }
  }