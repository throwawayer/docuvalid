import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import DocumentsStore from 'stores/DocumentsStore';
import AppContainer from 'containers/AppContainer';
import SpinnerContainer from 'containers/common/SpinnerContainer';

const DocumentsContainer = React.lazy(() => import('containers/DocumentsContainer'));

export default (
  <Router>
    <AppContainer>
      <Switch>
        <Route
          path="/"
          render={() => (
            <Suspense fallback={<SpinnerContainer />}>
              <DocumentsContainer documentsStore={new DocumentsStore()} />
            </Suspense>
          )}
        />
      </Switch>
    </AppContainer>
  </Router>
);
