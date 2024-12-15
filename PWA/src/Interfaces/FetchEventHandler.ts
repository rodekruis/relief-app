import { FetchEvent } from "./FetchEvent.js";

export interface FetchEventHandler {
  canHandleEvent(event: FetchEvent): boolean;
  handleEvent(event: FetchEvent): Promise<Response | undefined>;
}
