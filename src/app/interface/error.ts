// Array type for detailed error information
export type TErrorSources = {
  path: string | number;
  message: string;
}[];

// Structure for a standard error response
export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSources;
};
