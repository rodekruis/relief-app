import mustache from "../ExternalLibraries/mustache.js";
import { RouteEvents } from "../RouteEvents.js";
export class ResponseTools {
    static async wrapInHTPLTemplateAndReplaceKeysWithValues(routeEvent, keysAndValues) {
        return ResponseTools.replaceTemplateKeysWithValues(await ResponseTools.wrapInHtmlTemplate(routeEvent), keysAndValues);
    }
    static async replaceTemplateKeysWithValues(oldResponse, keysAndValues) {
        console.debug("Will update template using keys and values:");
        console.debug(keysAndValues);
        return this.changeResponseText(oldResponse, (oldResponseText) => {
            const untypedMustache = mustache;
            console.log("Template text:");
            console.log(oldResponseText);
            const changedText = untypedMustache.render(oldResponseText, keysAndValues);
            return changedText;
        });
    }
    static async wrapInHtmlTemplate(routeEvent) {
        return this.replaceTemplateKeysWithValues(await this.cachedPage(RouteEvents.template), {
            content: await (await this.cachedPage(routeEvent)).text()
        });
    }
    static async fetchFromCacheWithRemoteAsFallBack(file) {
        const responseFromCache = await caches.match(file);
        if (responseFromCache) {
            console.log("Retrieved index from cache");
            return responseFromCache;
        }
        else {
            console.log("Failed to retrief index from cache");
            return fetch(RouteEvents.home);
        }
    }
    static async changeResponseText(oldResponse, responseTextChanger) {
        try {
            const oldResponseText = await oldResponse.text();
            console.log("Will change oldResponsetext:");
            console.log(oldResponseText);
            const newResponseText = responseTextChanger(oldResponseText);
            return new Response(newResponseText, oldResponse);
        }
        catch (error) {
            console.error(error);
            return oldResponse;
        }
    }
    static async cachedPage(routeEvent) {
        const cachedPage = await caches.match(routeEvent);
        if (cachedPage) {
            console.debug("retrieved cached page: " + cachedPage + " for route event: " + routeEvent);
            return cachedPage;
        }
        else {
            throw "Failed to retrieve page from routeEvent " + routeEvent + " from cache";
        }
    }
}
