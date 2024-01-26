import { Beneficiary } from "../Models/Beneficiary";
import { BenificiaryJsonValidator } from "./BenificiaryJsonValidator";
import { FormParser } from "./FormParser";
import { SpreadSheetFileParser } from "./SpreadSheetFileParser";

export class BeneficiaryDeserializationService {
  async deserializeFormDataFromRequest(
    request: Request
  ): Promise<Beneficiary[]> {
    return new Promise<Beneficiary[]>(async (resolve, reject) => {
        const possibleFile = FormParser.firstFileFromFormData(await request.formData());
          if (possibleFile instanceof File) {
            const json = await SpreadSheetFileParser.jsonFromSpreadSheetFile(
              possibleFile
            );
            if (BenificiaryJsonValidator.isValidBenificiaryJson(json)) {
              return resolve(this.deserializeJson(json))
            } else {
              return reject("Invalid format for beneficiary rows");
            }
          } else {
            return reject("Expected upload item of file type")
          }
    });
  }

  deserializeJson(json: any): Beneficiary[] {
    console.log("deserializing json:")
    console.log(json)
    return this.rowsFromJson(json)
                .map((row: any) => {
                    return new Beneficiary(
                      this.codeFromJsonRow(row),
                      this.columnsFromJsonRow(row),
                      this.valuesFromJsonRow(row)
                      )
                })
  }

  private rowsFromJson(json: any): any[][] {
    return Object.values(json)
  }

  private codeFromJsonRow(jsonRow: any): string {
    return jsonRow["code"]
  }

  private columnsFromJsonRow(jsonRow: any): string[] {
    return Object.keys(jsonRow)
  }

  private valuesFromJsonRow(jsonRow: any): string[] {
    return Object.values(jsonRow)
  }
}
