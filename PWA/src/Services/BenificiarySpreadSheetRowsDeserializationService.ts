import { Beneficiary } from "../Models/Beneficiary.js";
import { BenificiaryJsonValidator } from "./BenificiaryJsonValidator.js";
import { FormParser } from "./FormParser.js";
import { SpreadSheetFileParser } from "./SpreadSheetFileParser.js";

export class BenificiarySpreadSheetRowsDeserializationService {
  static async deserializeFormDataFromRequest(
    request: Request
  ): Promise<Beneficiary[]> {
    return new Promise<Beneficiary[]>(async (resolve, reject) => {
        const possibleFile = FormParser.firstFileFromFormData(await request.formData());
          if (possibleFile instanceof File) {
            const json = await SpreadSheetFileParser.jsonFromSpreadSheetFile(
              possibleFile
            );
            if (BenificiaryJsonValidator.isValidBenificiaryJson(json)) {
                const rows: Beneficiary[] = this.rowsFromJson(json)
                .map((row: any) => this.commaSeparatedValuesFromJsonRow(row))
                .map((commaSeparatedRowValues: string) => {
                    return new Beneficiary(commaSeparatedRowValues)
                }
                )
              return resolve(rows)
            } else {
              return reject("Invalid format for benificiary rows");
            }
          } else {
            return reject("Expected upload item of file type")
          }
    });
  }

  private static rowsFromJson(json: any): any[][] {
    return Object.values(json)
  }

  private static commaSeparatedValuesFromJsonRow(json: any) {
    return Object.keys(json)
      .map((key: string) => {
        return json[key]
      })
      .reduce((previousValue: string, currentValue: string, currentIndex: number, array: string[]) => {
        return previousValue + "," + currentValue
      })
  }
}
