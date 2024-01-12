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
