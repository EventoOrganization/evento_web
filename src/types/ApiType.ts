export type ApiResponseType<T> = {
  success: boolean;
  code: number;
  message: string;
  body: T;
};
