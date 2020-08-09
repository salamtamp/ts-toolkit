export interface Requester {
  get(url: string, headers: object): Promise<any>;
  post(url: string, headers: object, payload: any): Promise<any>;
}
