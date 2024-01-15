export class Beneficiary {
    code: string
    comma_separated_cells: string

    constructor(
        code: string,
        comma_separated_cells: string
      ) {
        this.code = code
        this.comma_separated_cells = comma_separated_cells
      }
}