export interface FetchEvent {
  request: Request;
  respondWith(response: any): void;
}
