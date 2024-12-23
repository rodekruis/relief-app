import { Beneficiary } from "../Models/Beneficiary.js";
import { FormParser } from "./FormParser.js";
import { SpreadSheetService } from "./SpreadSheetService.js";
export class BeneficiaryDeserializationService {
    async deserializeFormDataFromRequest(request, distributionName) {
        return new Promise(async (resolve, reject) => {
            const possibleFile = FormParser.firstFileFromFormData(await request.formData());
            if (possibleFile instanceof File) {
                const json = await SpreadSheetService.jsonFromSpreadSheetFile(possibleFile);
                try {
                    return resolve(this.deserializeJson(json, distributionName));
                }
                catch (error) {
                    return reject(error);
                }
            }
            else {
                return reject("Expected upload item of file type");
            }
        });
    }
    deserializeJson(json, distributionName) {
        return this.rowsFromJson(json)
            .map((row) => {
            return new Beneficiary(this.codeFromJsonRow(row), this.columnsFromJsonRow(row), this.valuesFromJsonRow(row), distributionName);
        });
    }
    rowsFromJson(json) {
        return Object.values(json);
    }
    codeFromJsonRow(jsonRow) {
        const code = jsonRow["code"];
        if (code) {
            return code.toString();
        }
        else {
            throw Error("Expected beneficiary code");
        }
    }
    columnsFromJsonRow(jsonRow) {
        return Object.keys(jsonRow);
    }
    valuesFromJsonRow(jsonRow) {
        return Object.values(jsonRow);
    }
}
