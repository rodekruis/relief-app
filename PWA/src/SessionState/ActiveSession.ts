export class ActiveSession {
    nameOfLastViewedDistribution?: String
  
    static singleton = new ActiveSession()
  }