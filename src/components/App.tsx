import React from 'react';

import { AppProps } from 'models/AppModel';

const App = ({ children }: AppProps): JSX.Element => (
  <div className="page-container">
    <header className="page-container-header">
      <h1>Document validator</h1>
    </header>
    <article className="page-container-body">
      <header className="page-container-body-header">
        <h2 className="page-container-body-header__title">Hello</h2>
        <p className="page-container-body-header__text">
          The following application gets a list of documents from a remote server and use that remote server to check
          the validity of those documents.
        </p>
        <p className="page-container-body-header__text">
          The last column in the table contains a button that allows a user to validate a document. The result of
          validation is shown via status circles, which show the progress in standard way:
        </p>
        <ul className="page-container-body-header__text">
          <li>
            <em className="stressed-idle">gray</em>
            &nbsp;stands for idle;
          </li>
          <li>
            <em className="stressed-pending">rotating</em>
            &nbsp;for pending;
          </li>
          <li>
            <em className="stressed-success">green</em>
            &nbsp;for successful validation;
          </li>
          <li>
            {' '}
            <em className="stressed-error">red</em>
            &nbsp;for the failed one;
          </li>
        </ul>
      </header>
      <section className="page-container-body__content">{children}</section>
    </article>
  </div>
);

export default App;
