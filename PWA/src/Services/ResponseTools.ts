import mustache from "../ExternalLibraries/mustache.js";
import { RouteEvents } from "../RouteEvents.js";

export class ResponseTools {
  static async replaceTemplateKeysWithValues(
    oldResponse: Response,
    keysAndValues: { [key: string]: any }
  ): Promise<Response> {
    return this.changeResponseText(oldResponse, (oldResponseText: string) => {
      const untypedMustache = mustache as any
      const changedText = untypedMustache.render(oldResponseText, keysAndValues)
      return changedText
    });
  }

  static async wrapInHtmlTemplate(routeEvent: RouteEvents): Promise<Response> {
    return this.replaceTemplateKeysWithValues(await this.cachedPage(RouteEvents.template) as Response, {
      content: (await this.cachedPage(routeEvent)).text() 
    })
  }

  private static async changeResponseText(
    oldResponse: Response,
    responseTextChanger: (text: string) => string
  ): Promise<Response> {
    try {
      const oldResponseText = await oldResponse.text();
      const newResponseText = responseTextChanger(oldResponseText);

      return new Response(newResponseText, oldResponse);
    } catch (error) {
      console.log(error);
      return oldResponse;
    }
  }

  private static async cachedPage(routeEvent: RouteEvents): Promise<Response> {
    return await caches.match(routeEvent as string) as Response
  }
}