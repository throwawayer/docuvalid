import DocumentValidationStatus from 'models/Enums';

export type StoreProps = {
  documents: Document[];
  error: ErrorResponseData | null;
};

export type ComponentProps = {
  documents: Document[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  handleValidate: (id: string) => void;
  handleValidateAll: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleReload: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export interface Document extends DocumentValids {
  id: string;
  filename: string;
  author: string;
  created_at: string;
  hash: string;
  size: number;
  validationStatus?: DocumentValidationStatus;
}

export type GetDocumentsParams = {
  page: number;
  perPage: number;
};

export type ValidateRequestParams = {
  id: string;
};

export interface DocumentValids {
  isChecksumValid?: boolean;
  isSchemaValid?: boolean;
  isSignatureValid?: boolean;
}

export type SuccessfulResponseData = {
  meta: MetaData;
  data: Document[];
};

export type ErrorResponseData = {
  error: {
    code: number;
    message: string;
  };
};

type MetaData = {
  page: number;
  pagesCount: number;
  perPage: number;
};
