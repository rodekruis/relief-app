export class Beneficiary {
    code: string
    columns: string[]
    values: string[]
    distributionName: string
    hasBeenMarkedAsReceived: boolean
    dateReceived?: string

    constructor(
        code: string,
        columns: string[],
        values: string[],
        distributionName: string
      ) {
        this.code = code
        this.columns = columns
        this.values = values
        this.distributionName = distributionName
        this.hasBeenMarkedAsReceived = false
        this.dateReceived = undefined
      }
}