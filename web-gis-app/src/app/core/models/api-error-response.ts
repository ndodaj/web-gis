export interface ApiErrorResponse {
  errorId: string;
  exception: string;
  Messages: Array<string>;
  source: string;
  statusCode: number;
  supportMessage: string;
}
