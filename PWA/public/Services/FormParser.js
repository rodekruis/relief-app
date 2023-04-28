export class FormParser {
    static firstFileFromFormData(formData) {
        for (const keyValuePair of formData.entries()) {
            const possibleFile = keyValuePair[1];
            if (possibleFile instanceof File) {
                return possibleFile;
            }
        }
        return null;
    }
}
// TODO: Move
export class BenificiaryDataParser {
    static isValidBenificiaryJson(json) {
        const rows = this.rowsFromJson(json);
        if (rows.length == 0) {
            console.log("Expected more than zero rows of data");
            return false;
        }
        for (const row in rows) {
            if (!this.rowHasCodeColumn(row)) {
                console.log("Expected row to have column named code");
                return false;
            }
        }
        return true;
    }
    static rowsFromJson(json) {
        return Object.values(json);
    }
    static rowHasCodeColumn(jsonRow) {
        return Object.keys(jsonRow)
            .indexOf("code") > -1;
    }
}
