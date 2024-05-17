import mustache from "../ExternalLibraries/mustache.js";
import { RouteEvents } from "../RouteEvents.js";

export class ResponseTools {
  static async wrapInHTPLTemplateAndReplaceKeysWithValues(
    routeEvent: RouteEvents,
    keysAndValues: { [key: string]: any }
  ): Promise<Response> {
    return ResponseTools.replaceTemplateKeysWithValues(
      await ResponseTools.wrapInHtmlTemplate(routeEvent),
      keysAndValues
    )
  }

  static async replaceTemplateKeysWithValues(
    oldResponse: Response,
    keysAndValues: { [key: string]: any }
  ): Promise<Response> {
    console.debug("Will update template using keys and values:")
    console.debug(keysAndValues)
    return this.changeResponseText(oldResponse, (oldResponseText: string) => {
      const untypedMustache = mustache as any
      console.log("Template text:")
      console.log(oldResponseText)
      const changedText = untypedMustache.render(oldResponseText, keysAndValues)
      return changedText
    });
  }

  static async wrapInHtmlTemplate(routeEvent: RouteEvents): Promise<Response> {
    return this.replaceTemplateKeysWithValues(await this.cachedPage(RouteEvents.template) as Response, {
      content: await (await this.cachedPage(routeEvent)).text() 
    })
  }

  private static async changeResponseText(
    oldResponse: Response,
    responseTextChanger: (text: string) => string
  ): Promise<Response> {
    try {
      const oldResponseText = await oldResponse.text();
      console.log("Will change oldResponsetext:")
      console.log(oldResponseText)
      const newResponseText = responseTextChanger(oldResponseText);

      return new Response(newResponseText, oldResponse);
    } catch (error) {
      console.error(error);
      return oldResponse;
    }
  }

  private static async cachedPage(routeEvent: RouteEvents): Promise<Response> {
    const cachedPage =  await caches.match(routeEvent as string) as Response
    if(cachedPage) {
      console.debug("retrieved cached page: " + cachedPage + " for route event: " + routeEvent)
      return cachedPage
    } else {
      throw "Failed to retrieve page from routeEvent " + routeEvent + " from cache"
    }
  }
}