import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';

import Documents from 'components/Documents';
import DocumentsStore from 'stores/DocumentsStore';

const DocumentsContainer: React.FC<{
  documentsStore: DocumentsStore;
}> = observer((props) => {
  const { documentsStore } = props;
  const { documents, error } = documentsStore;

  const getDocuments = documentsStore.getDocuments.bind(documentsStore);
  const validate = documentsStore.validate.bind(documentsStore);
  const validateAll = documentsStore.validateAll.bind(documentsStore);

  const perPage = useRef(15);
  const page = useRef(1);

  const handleReload = (): void => {
    getDocuments({ page: page.current, perPage: perPage.current }).then(
      () => {},
      () => {},
    );
  };

  const handleValidate = (id: string): void => {
    validate(id).then(
      () => {},
      () => {},
    );
  };

  const handleValidateAll = (): void => {
    validateAll();
  };

  React.useEffect(() => {
    handleReload();
  }, []);

  window.onscroll = (e: Event) => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      e.preventDefault();
      page.current += 1;
      handleReload();
    }
  };

  return (
    <Documents
      documents={documents}
      error={error}
      handleValidate={handleValidate}
      handleValidateAll={handleValidateAll}
      handleReload={handleReload}
    />
  );
});

export default DocumentsContainer;
