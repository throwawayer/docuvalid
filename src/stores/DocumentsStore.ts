import { makeObservable, observable, runInAction, action } from 'mobx';

import { getDocuments, validateChecksum, validateSchema, validateSignature } from 'api/documents';
import { Document, DocumentValids, GetDocumentsParams, StoreProps } from 'models/DocumentsModel';
import DocumentValidationStatus from 'models/Enums';

export default class DocumentsStore {
  documents: Document[] = [];

  validationResolvers: ((valid: boolean, id: string) => void)[];

  error: unknown = null;

  constructor(props?: StoreProps) {
    makeObservable(this, {
      documents: observable,
      error: observable,
      validate: action,
      changeDocumentStatus: action,
    });

    if (props) {
      this.documents = props.documents;
      this.error = props.error;
    }

    this.validationResolvers = [
      (valid: boolean, id: string) => {
        this.changeDocumentStatus(id, DocumentValidationStatus.validatingSchema, 'isChecksumValid', valid);
      },
      (valid: boolean, id: string) => {
        this.changeDocumentStatus(id, DocumentValidationStatus.validatingSignature, 'isSchemaValid', valid);
      },
      (valid: boolean, id: string) => {
        this.changeDocumentStatus(id, DocumentValidationStatus.idle, 'isSignatureValid', valid);
      },
    ];

    this.changeDocumentStatus = this.changeDocumentStatus.bind(this);
    this.getDocuments = this.getDocuments.bind(this);
    this.validateAll = this.validateAll.bind(this);
    this.validate = this.validate.bind(this);
  }

  changeDocumentStatus(
    id: string,
    status: DocumentValidationStatus,
    field?: keyof DocumentValids,
    valid?: boolean,
  ): void {
    runInAction(() => {
      this.documents = this.documents.map((document) => {
        if (document.id === id) {
          const newDocument: Document = { ...document };
          newDocument.validationStatus = status;

          if (field !== undefined) {
            newDocument[field] = valid;
          }

          return newDocument;
        }

        return document;
      });
    });
  }

  async getDocuments(params: GetDocumentsParams): Promise<void> {
    try {
      const response = await getDocuments(params);

      runInAction(() => {
        this.error = null;
        this.documents = this.documents.concat(response.data.data).map((document: Document) => ({
          ...document,
          validationStatus: DocumentValidationStatus.idle,
        }));
      });
    } catch (err) {
      runInAction(() => {
        this.error = err;
      });
    }
  }

  async validate(id: string): Promise<void> {
    this.changeDocumentStatus(id, DocumentValidationStatus.validatingChecksum);

    const promises = [
      {
        request: validateChecksum,
        step: DocumentValidationStatus.validatingChecksum,
      },
      {
        request: validateSchema,
        step: DocumentValidationStatus.validatingSchema,
      },
      {
        request: validateSignature,
        step: DocumentValidationStatus.validatingSignature,
      },
    ];

    for (let i = 0; i < promises.length; i += 1) {
      const { request, step } = promises[i];

      try {
        // eslint-disable-next-line no-await-in-loop
        const { data } = await request({ id });
        this.validationResolvers[step](data.valid, id);
      } catch (err) {
        this.changeDocumentStatus(
          id,
          DocumentValidationStatus.idle,
          ['isChecksumValid', 'isSchemaValid', 'isSignatureValid'][step] as keyof DocumentValids,
          false,
        );
      }
    }
  }

  validateAll(): void {
    this.documents.forEach((document) => {
      this.validate(document.id).then(
        () => {},
        () => {},
      );
    });
  }
}
