export class Beneficiary {
    code: string
    columns: string[]
    values: string[]

    constructor(
        code: string,
        columns: string[],
        values: string[]
      ) {
        this.code = code
        this.columns = columns
        this.values = values
      }
}