/* eslint-disable max-len */
import '@testing-library/jest-dom';
import { waitFor, render, screen } from '@testing-library/react';

import React from 'react';

import AppContainer from 'containers/AppContainer';

const firstParagraph =
  'The following application gets a list of documents from a remote server and use that remote server to check the validity of those documents.';
const secondParagraph =
  'The last column in the table contains a button that allows a user to validate a document. The result of validation is shown via status circles, which show the progress in standard way:';

describe('AppContainer', () => {
  it('should render correctly', async () => {
    render(<AppContainer />);

    await waitFor(() => {
      const headers = screen.getAllByRole('heading');

      ['Document validator', 'Hello'].forEach((header, index) => {
        expect(headers[index]).toHaveTextContent(header);
      });
    });

    expect(screen.getByText(firstParagraph)).toBeInTheDocument();
    expect(screen.getByText(secondParagraph)).toBeInTheDocument();
    expect(screen.getByText('gray')).toHaveClass('stressed-idle');
    expect(screen.getByText('rotating')).toHaveClass('stressed-pending');
    expect(screen.getByText('green')).toHaveClass('stressed-success');
    expect(screen.getByText('red')).toHaveClass('stressed-error');
  });
});
