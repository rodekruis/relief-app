import mustache from "../ExternalLibraries/mustache.js";
import { RouteEvents } from "../RouteEvents.js";
export class ResponseTools {
    static async replaceTemplateKeysWithValues(oldResponse, keysAndValues) {
        return this.changeResponseText(oldResponse, (oldResponseText) => {
            const untypedMustache = mustache;
            const changedText = untypedMustache.render(oldResponseText, keysAndValues);
            return changedText;
        });
    }
    static async wrapInHtmlTemplate(routeEvent) {
        return this.replaceTemplateKeysWithValues(await this.cachedPage(RouteEvents.template), {
            content: (await this.cachedPage(routeEvent)).text()
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
    static async cachedPage(routeEvent) {
        return await caches.match(routeEvent);
    }
}
