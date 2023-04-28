export class ResponseTools {
    static async replaceTemplateKeysWithValues(oldResponse, keysAndValues) {
        return this.changeResponseText(oldResponse, (oldResponseText) => {
            return Object.keys(keysAndValues).reduce((previousResponseText, currentKey) => {
                return this.replaceAllOccurrencesOf(this.wrapInHandleBars(currentKey), keysAndValues[currentKey], previousResponseText);
            }, oldResponseText);
        });
    }
    static async repeatInsertionOfValues(oldResponse, enumerationIdentifier, values) {
        return this.changeResponseText(oldResponse, (oldResponseText) => {
            const rawTemplate = this.enumerationTemplateFromStringWithIdentfier(oldResponseText, enumerationIdentifier);
            const cleanTemplate = this.removeTemplateCodeFromString(rawTemplate);
            const populatedTemplate = values.reduce((previousText, currentValue) => {
                return previousText + "\n" + this.replaceAllOccurrencesOf(this.wrapInHandleBars(enumerationIdentifier), currentValue, cleanTemplate);
            }, "");
            return this.replaceAllOccurrencesOf(rawTemplate, populatedTemplate, oldResponseText);
        });
    }
    static async replaceHandleBarContent(oldResponse, match, replacementString) {
        return this.replaceResponseBody(oldResponse, this.wrapInHandleBars(match), replacementString);
    }
    static async replaceResponseBody(oldResponse, match, replacementString) {
        return this.changeResponseText(oldResponse, (oldResponseText) => {
            return this.replaceAllOccurrencesOf(match, replacementString, oldResponseText);
        });
    }
    static async changeResponseText(oldResponse, responseTextChanger) {
        try {
            const oldResponseText = await oldResponse.text();
            const newResponseText = responseTextChanger(oldResponseText);
            return new Response(newResponseText, oldResponse);
        }
        catch (error) {
            console.log(error);
            return oldResponse;
        }
    }
    static async removeFromResponseBody(oldResponse, match) {
        return this.replaceResponseBody(oldResponse, match, "");
    }
    static replaceAllOccurrencesOf(match, replacement, stringToAlter) {
        if (this.isMatchAvailableInString(match, stringToAlter)) {
            return this.replaceAllOccurrencesOf(match, replacement, stringToAlter.replace(match, replacement));
        }
        else {
            return stringToAlter;
        }
    }
    static isMatchAvailableInString(match, string) {
        if (typeof match === "string") {
            return string.includes(match);
        }
        else {
            return string.match(match) != null;
        }
    }
    static wrapInHandleBars(string) {
        return "{{ " + string + " }}";
    }
    static enumerationTemplateFromStringWithIdentfier(string, identifier) {
        var _a, _b;
        return (_b = (_a = string.match(this.enumerationTemplateRegex(identifier))) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : "";
    }
    static removeTemplateCodeFromString(string) {
        return this.replaceAllOccurrencesOf(/{% .* %}/, "", string);
    }
    static enumerationTemplateRegex(identifier) {
        return RegExp("{% for " + identifier + " in .* %}(\n|.)*?{% endfor %}");
    }
}
