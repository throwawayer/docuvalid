import React from 'react';

import App from 'components/App';
import { AppProps } from 'models/AppModel';

const AppContainer: React.FC = ({ children }: AppProps) => <App>{children}</App>;

export default AppContainer;
