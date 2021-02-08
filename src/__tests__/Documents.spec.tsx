/* eslint-disable no-await-in-loop */
import '@testing-library/jest-dom';
import { fireEvent, waitFor, within, render, screen } from '@testing-library/react';

import React from 'react';
import { rest } from 'msw';
import { _resetGlobalState } from 'mobx';
import { setupServer } from 'msw/node';

import client from 'api/client';
import successfulDocumentsResponse from '__tests__/mockdata/documentsResponse';
import DocumentsStore from 'stores/DocumentsStore';
import DocumentsContainer from 'containers/DocumentsContainer';

const perPage = 15;
const page = 1;

const server = setupServer(
  rest.get(`${client.defaults.baseURL}/documents?perPage=${perPage}&page=${page}`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(successfulDocumentsResponse)),
  ),
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  _resetGlobalState();
});
afterAll(() => server.close());

describe('DocumentsContainer', () => {
  it('should render correctly', async () => {
    render(
      <DocumentsContainer
        documentsStore={
          new DocumentsStore({
            documents: successfulDocumentsResponse.data,
            error: null,
          })
        }
      />,
    );

    await waitFor(() => {
      const headers = screen.getAllByRole('heading');

      ['Documents', 'Filename', 'Author', 'Created', 'Size (in MB)'].forEach((header, index) => {
        expect(headers[index]).toHaveTextContent(header);
      });
    });

    const table = screen.getByRole('table');
    const tableBody = within(table).getByRole('rowgroup');
    const tableElems = within(tableBody).getAllByRole('row');

    expect(table).toBeInTheDocument();
    expect(tableBody).toBeInTheDocument();
    expect(tableElems).toHaveLength(15);

    const documentsTableRow = [
      ['et ultrices posuere.jpeg', 'shauger0', 'Fri Jan 25 2019', '45554mb', 'Validate'],
      ['felis donec.mpeg', 'moakey1', 'Thu Jan 10 2019', '19919mb', 'Validate'],
      ['orci.mp3', 'scollie2', 'Fri Jan 18 2019', '16790mb', 'Validate'],
      ['maecenas.mp3', 'bbarwick3', 'Sun Mar 11 2018', '19258mb', 'Validate'],
      ['nullam varius nulla.gif', 'areimer4', 'Sun Dec 09 2018', '90421mb', 'Validate'],
      ['duis.ppt', 'jghelardoni5', 'Sun Jul 29 2018', '47918mb', 'Validate'],
      ['at velit.ppt', 'agisbourn6', 'Sun Apr 01 2018', '86883mb', 'Validate'],
      ['bibendum felis sed.tiff', 'akesterton7', 'Sat Oct 20 2018', '42429mb', 'Validate'],
      ['rutrum at lorem.png', 'hebanks8', 'Tue May 08 2018', '77359mb', 'Validate'],
      ['pretium iaculis diam.mpeg', 'gmatskiv9', 'Tue Jun 19 2018', '38771mb', 'Validate'],
      ['ultrices.doc', 'mhaslinga', 'Sat Dec 29 2018', '67040mb', 'Validate'],
      ['risus.gif', 'wlawryb', 'Tue Apr 24 2018', '37323mb', 'Validate'],
      ['justo nec.jpeg', 'dfilipponec', 'Sun Oct 07 2018', '11461mb', 'Validate'],
      ['magnis.ppt', 'smaclachland', 'Tue Mar 13 2018', '49610mb', 'Validate'],
      ['elementum nullam varius.mp3', 'pdebille', 'Fri Oct 19 2018', '61198mb', 'Validate'],
    ];

    documentsTableRow.forEach((row, rowIndex) => {
      const currentRow = within(tableElems[rowIndex]);
      const cells = currentRow.getAllByRole('cell');

      row.forEach((content, cellIndex) => {
        expect(cells[cellIndex]).toHaveTextContent(content);
      });

      expect(currentRow.getByRole('button')).not.toBeDisabled();
      expect(currentRow.getByTitle('Checksum')).toHaveClass('status__item');
      expect(currentRow.getByTitle('Schema')).toHaveClass('status__item');
      expect(currentRow.getByTitle('Signature')).toHaveClass('status__item');
    });
  });

  it('should display error on failed initial render', async () => {
    server.use(
      rest.get(`${client.defaults.baseURL}/documents?perPage=${perPage}&page=${page}`, (req, res, ctx) =>
        res.once(
          ctx.status(503),
          ctx.json({
            error: {
              code: 503,
              message: 'Service temporarily unavailable',
            },
          }),
        ),
      ),
    );

    render(
      <DocumentsContainer
        documentsStore={
          new DocumentsStore({
            documents: [],
            error: {
              error: {
                code: 503,
                message: 'Service temporarily unavailable',
              },
            },
          })
        }
      />,
    );

    await waitFor(() => {
      const [validateAllButton] = screen.getAllByRole('button');

      expect(validateAllButton).toHaveTextContent('Validate all');
      expect(validateAllButton).toBeDisabled();
    });

    const [, errorHeader] = screen.getAllByRole('heading');
    const [, reloadButton] = screen.getAllByRole('button');

    expect(errorHeader).toHaveTextContent('An error has occurred');
    expect(screen.getByText('Press the button below to fetch the data again.')).toBeInTheDocument();
    expect(reloadButton).toHaveTextContent('Reload');
    expect(reloadButton).not.toBeDisabled();
  });

  it('should successfully validate a single document', async () => {
    render(<DocumentsContainer documentsStore={new DocumentsStore()} />);

    let tableElems: HTMLElement[] = [];

    await waitFor(() => {
      tableElems = within(within(screen.getByRole('table')).getByRole('rowgroup')).getAllByRole('row');

      expect(tableElems).toHaveLength(15);
    });

    const url = `${client.defaults.baseURL}/documents/b019be14-8251-47d6-8269-1908d6fc1b45`;

    server.use(
      rest.post(`${url}/validateChecksum`, (req, res, ctx) => res.once(ctx.status(200), ctx.json({ valid: true }))),
      rest.post(`${url}/validateSchema`, (req, res, ctx) => res.once(ctx.status(200), ctx.json({ valid: true }))),
      rest.post(`${url}/validateSignature`, (req, res, ctx) => res.once(ctx.status(200), ctx.json({ valid: true }))),
    );

    let validateBtn = within(tableElems[0]).getByRole('button');

    expect(validateBtn).not.toBeDisabled();

    fireEvent.click(validateBtn);

    expect(validateBtn).toBeDisabled();

    tableElems = within(within(screen.getByRole('table')).getByRole('rowgroup')).getAllByRole('row');

    const checksumIcon = within(tableElems[0]).getByTitle('Checksum');
    const schemaIcon = within(tableElems[0]).getByTitle('Schema');
    const signatureIcon = within(tableElems[0]).getByTitle('Signature');
    validateBtn = within(tableElems[0]).getByRole('button');

    expect(checksumIcon).toHaveClass('status__item status__item--validating');
    expect(schemaIcon).toHaveClass('status__item');
    expect(signatureIcon).toHaveClass('status__item');

    await waitFor(() => {
      expect(checksumIcon).toHaveClass('status__item status__item--success');
      expect(schemaIcon).toHaveClass('status__item status__item--validating');
      expect(signatureIcon).toHaveClass('status__item');
      expect(validateBtn).toBeDisabled();
    });

    await waitFor(() => {
      expect(checksumIcon).toHaveClass('status__item status__item--success');
      expect(schemaIcon).toHaveClass('status__item status__item--success');
      expect(signatureIcon).toHaveClass('status__item status__item--validating');
      expect(validateBtn).toBeDisabled();
    });

    await waitFor(() => {
      expect(checksumIcon).toHaveClass('status__item status__item--success');
      expect(schemaIcon).toHaveClass('status__item status__item--success');
      expect(signatureIcon).toHaveClass('status__item status__item--success');
      expect(validateBtn).not.toBeDisabled();
    });
  });

  it('should display red icons on failed single document validation', async () => {
    render(<DocumentsContainer documentsStore={new DocumentsStore()} />);

    let tableElems: HTMLElement[] = [];

    await waitFor(() => {
      tableElems = within(within(screen.getByRole('table')).getByRole('rowgroup')).getAllByRole('row');

      expect(tableElems).toHaveLength(15);
    });

    const url = `${client.defaults.baseURL}/documents/b019be14-8251-47d6-8269-1908d6fc1b45`;

    server.use(
      rest.post(`${url}/validateChecksum`, (req, res, ctx) => res.once(ctx.status(200), ctx.json({ valid: false }))),
      rest.post(`${url}/validateSchema`, (req, res, ctx) =>
        res.once(
          ctx.status(503),
          ctx.json({
            error: {
              code: 503,
              message: 'Service temporarily unavailable',
            },
          }),
        ),
      ),
      rest.post(`${url}/validateSignature`, (req, res, ctx) =>
        res.once(
          ctx.status(404),
          ctx.json({
            error: {
              code: 404,
              message: 'Document not found',
            },
          }),
        ),
      ),
    );

    let validateBtn = within(tableElems[0]).getByRole('button');

    expect(validateBtn).not.toBeDisabled();

    fireEvent.click(validateBtn);

    expect(validateBtn).toBeDisabled();

    tableElems = within(within(screen.getByRole('table')).getByRole('rowgroup')).getAllByRole('row');

    const checksumIcon = within(tableElems[0]).getByTitle('Checksum');
    const schemaIcon = within(tableElems[0]).getByTitle('Schema');
    const signatureIcon = within(tableElems[0]).getByTitle('Signature');
    validateBtn = within(tableElems[0]).getByRole('button');

    expect(checksumIcon).toHaveClass('status__item status__item--validating');
    expect(schemaIcon).toHaveClass('status__item');
    expect(signatureIcon).toHaveClass('status__item');

    await waitFor(() => {
      expect(checksumIcon).toHaveClass('status__item status__item--error');
      expect(schemaIcon).toHaveClass('status__item status__item--validating');
      expect(signatureIcon).toHaveClass('status__item');
      expect(validateBtn).toBeDisabled();
    });

    await waitFor(() => {
      expect(checksumIcon).toHaveClass('status__item status__item--error');
      expect(schemaIcon).toHaveClass('status__item status__item--error');
      expect(signatureIcon).toHaveClass('status__item status__item--error');
      expect(validateBtn).not.toBeDisabled();
    });
  });

  it('should validate all documents and have no idle(gray) status icons', async () => {
    const testDocuments = successfulDocumentsResponse.data.slice(0, 3);
    const generateRandomValidationRequest = () => {
      const serverRequests = [];

      for (let i = 0; i < testDocuments.length; i += 1) {
        const url = `${client.defaults.baseURL}/documents/${testDocuments[i].id}`;
        const isEven = i % 2 === 0;

        serverRequests.push(
          rest.post(`${url}/validateChecksum`, (req, res, ctx) =>
            res.once(ctx.status(isEven ? 200 : 503), ctx.json({ valid: isEven })),
          ),
          rest.post(`${url}/validateSchema`, (req, res, ctx) =>
            res.once(ctx.status(isEven ? 404 : 200), ctx.json({ valid: !isEven })),
          ),
          rest.post(`${url}/validateSignature`, (req, res, ctx) =>
            res.once(ctx.status(200), ctx.json({ valid: isEven })),
          ),
        );
      }

      return serverRequests;
    };

    server.use(
      rest.get(`${client.defaults.baseURL}/documents?perPage=${perPage}&page=${page}`, (req, res, ctx) =>
        res(ctx.status(200), ctx.json(testDocuments)),
      ),
    );

    render(
      <DocumentsContainer
        documentsStore={
          new DocumentsStore({
            documents: testDocuments,
            error: null,
          })
        }
      />,
    );

    let tableElems: HTMLElement[] = [];
    await waitFor(() => {
      tableElems = within(within(screen.getByRole('table')).getByRole('rowgroup')).getAllByRole('row');

      expect(tableElems).toHaveLength(3);
    });

    server.use(...generateRandomValidationRequest());

    const validateAllBtn = screen.getByRole('button', { name: 'Validate all' });

    expect(validateAllBtn).not.toBeDisabled();

    fireEvent.click(validateAllBtn);

    await waitFor(() => {
      tableElems = within(within(screen.getByRole('table')).getByRole('rowgroup')).getAllByRole('row');

      expect(tableElems).toHaveLength(3);
    });

    for (let i = 0; i < testDocuments.length; i += 1) {
      const checksumIcon = await within(tableElems[0]).findByTitle('Checksum');
      const schemaIcon = await within(tableElems[0]).findByTitle('Schema');
      const signatureIcon = await within(tableElems[0]).findByTitle('Signature');

      expect(checksumIcon.className).not.toEqual('status__item');
      expect(schemaIcon.className).not.toEqual('status__item');
      expect(signatureIcon.className).not.toEqual('status__item');
    }
  });
});
