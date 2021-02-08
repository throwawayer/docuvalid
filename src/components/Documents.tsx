import React from 'react';
import cx from 'classnames';

import ButtonContainer from 'containers/common/ButtonContainer';
import SpinnerContainer from 'containers/common/SpinnerContainer';
import { ComponentProps } from 'models/DocumentsModel';
import DocumentValidationStatus from 'models/Enums';

const Documents = ({
  documents,
  error,
  handleValidate,
  handleValidateAll,
  handleReload,
}: ComponentProps): JSX.Element => {
  const documentsNotFetched = error === null && documents.length === 0;
  let documentsContentBody;

  if (documentsNotFetched) {
    documentsContentBody = <SpinnerContainer />;
  }

  if (error === null && documents.length > 0) {
    documentsContentBody = (
      <div className="documents-content" role="rowgroup">
        {documents.map((document) => {
          const { validationStatus, isChecksumValid, isSchemaValid, isSignatureValid } = document;

          const isChecksumValidating = validationStatus === DocumentValidationStatus.validatingChecksum;
          const isSchemaValidating = validationStatus === DocumentValidationStatus.validatingSchema;
          const isSignatureValidating = validationStatus === DocumentValidationStatus.validatingSignature;

          const apiIsPending = validationStatus !== DocumentValidationStatus.idle;

          const checksumClassName = cx('status__item', {
            'status__item--validating': isChecksumValidating,
            'status__item--success': !isChecksumValidating && isChecksumValid !== undefined && !!isChecksumValid,
            'status__item--error': !isChecksumValidating && isChecksumValid !== undefined && !isChecksumValid,
          });

          const schemaClassName = cx('status__item', {
            'status__item--validating': isSchemaValidating,
            'status__item--success': !isSchemaValidating && isSchemaValid !== undefined && !!isSchemaValid,
            'status__item--error': !isSchemaValidating && isSchemaValid !== undefined && !isSchemaValid,
          });

          const signatureClassName = cx('status__item', {
            'status__item--validating': isSignatureValidating,
            'status__item--success': !isSignatureValidating && isSignatureValid !== undefined && !!isSignatureValid,
            'status__item--error': !isSignatureValidating && isSignatureValid !== undefined && !isSignatureValid,
          });

          return (
            <div className="documents-content-body" key={`${document.author}${document.hash}`} role="row">
              <span className="documents-content-body__item" role="cell">
                {document.filename}
              </span>
              <span className="documents-content-body__item" role="cell">
                {document.author}
              </span>
              <time dateTime={document.created_at} className="documents-content-body__item" role="cell">
                {new Date(document.created_at).toDateString()}
              </time>
              <span className="documents-content-body__item" role="cell">
                {`${Math.floor(document.size / 1024)}mb`}
              </span>
              <span className="documents-content-body__item documents-content-body__item--last" role="cell">
                <ButtonContainer
                  btnType="secondary"
                  disabled={documentsNotFetched || apiIsPending}
                  onClick={() => handleValidate(document.id)}
                >
                  Validate
                </ButtonContainer>
                <div className="status" role="cell">
                  <span className={checksumClassName} title="Checksum" />
                  <span className={schemaClassName} title="Schema" />
                  <span className={signatureClassName} title="Signature" />
                </div>
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="documents" role="table">
      <header className="documents-header">
        <h3 className="documents-header__item documents-header__item--with-margin">Documents</h3>
        <div className="documents-header__item">
          <ButtonContainer
            btnType="primary"
            disabled={!documentsNotFetched && error !== null}
            onClick={handleValidateAll}
          >
            Validate all
          </ButtonContainer>
        </div>
      </header>
      {!error ? (
        <header className="documents-contentheader">
          <h4 className="documents-contentheader__item">Filename</h4>
          <h4 className="documents-contentheader__item">Author</h4>
          <h4 className="documents-contentheader__item">Created</h4>
          <h4 className="documents-contentheader__item">Size (in MB)</h4>
          <span className="documents-contentheader__item" />
        </header>
      ) : (
        <div className="documents-contentheader documents-contentheader--error">
          <div className="documents-contentheader__item">
            <h2>An error has occurred</h2>
          </div>
          <div className="documents-contentheader__item">
            <p className="no-margin">Press the button below to fetch the data again.</p>
            <br />
            <ButtonContainer btnType="primary" onClick={() => handleReload()}>
              Reload
            </ButtonContainer>
          </div>
        </div>
      )}
      {documentsContentBody}
    </div>
  );
};

export default Documents;
