import { BenificiarySpreadSheetRow } from "../Models/BenificiarySpreadSheetRow.js";
import { BenificiaryJsonValidator } from "./BenificiaryJsonValidator.js";
import { FormParser } from "./FormParser.js";
import { SpreadSheetFileParser } from "./SpreadSheetFileParser.js";
export class BenificiarySpreadSheetRowsDeserializationService {
    static async deserializeFormDataFromRequest(request) {
        return new Promise(async (resolve, reject) => {
            const possibleFile = FormParser.firstFileFromFormData(await request.formData());
            if (possibleFile instanceof File) {
                const json = await SpreadSheetFileParser.jsonFromSpreadSheetFile(possibleFile);
                if (BenificiaryJsonValidator.isValidBenificiaryJson(json)) {
                    const rows = this.rowsFromJson(json)
                        .map((row) => this.commaSeparatedValuesFromJsonRow(row))
                        .map((commaSeparatedRowValues) => {
                        return new BenificiarySpreadSheetRow(commaSeparatedRowValues);
                    });
                    return resolve(rows);
                }
                else {
                    return reject("Invalid format for benificiary rows");
                }
            }
            else {
                return reject("Expected upload item of file type");
            }
        });
    }
    static rowsFromJson(json) {
        return Object.values(json);
    }
    static commaSeparatedValuesFromJsonRow(json) {
        return Object.keys(json)
            .map((key) => {
            return json[key];
        })
            .reduce((previousValue, currentValue, currentIndex, array) => {
            return previousValue + "," + currentValue;
        });
    }
}
