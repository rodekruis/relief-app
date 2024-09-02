import { Beneficiary } from "../Models/Beneficiary.js";
import { FormParser } from "./FormParser.js";
import { SpreadSheetService } from "./SpreadSheetService.js";

export class BeneficiaryDeserializationService {
  async deserializeFormDataFromRequest(
    request: Request
  ): Promise<Beneficiary[]> {
    return new Promise<Beneficiary[]>(async (resolve, reject) => {
        const possibleFile = FormParser.firstFileFromFormData(await request.formData());
          if (possibleFile instanceof File) {
            const json = await SpreadSheetService.jsonFromSpreadSheetFile(
              possibleFile
            );
            try {
              return resolve(this.deserializeJson(json))
            } catch(error) {
              return reject(error);
            }
          } else {
            return reject("Expected upload item of file type")
          }
    });
  }

  deserializeJson(json: any): Beneficiary[] {
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
    const code = jsonRow["code"]
    if(code) {
      return code.toString()
    } else {
      throw Error("Expected beneficiary code")
    }
  }

  private columnsFromJsonRow(jsonRow: any): string[] {
    return Object.keys(jsonRow)
  }

  private valuesFromJsonRow(jsonRow: any): string[] {
    return Object.values(jsonRow)
  }
}
