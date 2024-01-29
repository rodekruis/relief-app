import { Database } from "./Database.js"

export class ActiveSession {
    nameOfLastViewedDistribution?: string
    database: Database
  
    constructor(database: Database) {
      this.database = database
    }
  }