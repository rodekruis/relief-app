import { Beneficiary } from "../Models/Beneficiary";
import { BenificiaryJsonValidator } from "./BenificiaryJsonValidator";
import { FormParser } from "./FormParser";
import { SpreadSheetFileParser } from "./SpreadSheetFileParser";
export class BeneficiaryDeserializationService {
    async deserializeFormDataFromRequest(request) {
        return new Promise(async (resolve, reject) => {
            const possibleFile = FormParser.firstFileFromFormData(await request.formData());
            if (possibleFile instanceof File) {
                const json = await SpreadSheetFileParser.jsonFromSpreadSheetFile(possibleFile);
                if (BenificiaryJsonValidator.isValidBenificiaryJson(json)) {
                    return resolve(this.deserializeJson(json));
                }
                else {
                    return reject("Invalid format for beneficiary rows");
                }
            }
            else {
                return reject("Expected upload item of file type");
            }
        });
    }
    deserializeJson(json) {
        console.log("deserializing json:");
        console.log(json);
        return this.rowsFromJson(json)
            .map((row) => {
            return new Beneficiary(this.codeFromJsonRow(row), this.columnsFromJsonRow(row), this.valuesFromJsonRow(row));
        });
    }
    rowsFromJson(json) {
        return Object.values(json);
    }
    codeFromJsonRow(jsonRow) {
        return jsonRow["code"];
    }
    columnsFromJsonRow(jsonRow) {
        return Object.keys(jsonRow);
    }
    valuesFromJsonRow(jsonRow) {
        return Object.values(jsonRow);
    }
}
