import React from 'react';
import cx from 'classnames';

import Button from 'components/common/Button';
import { ButtonContainerProps } from 'models/CommonModel';

const ButtonContainer = (props: ButtonContainerProps): JSX.Element => {
  const {
    className = '',
    btnType = '',
    children = '',
    isLoading = false,
    disabled = false,
    onClick,
    ...rest
  } = props;

  const btnClassNames = cx('btn', {
    [`btn--${btnType}`]: btnType,
    'btn--loading': isLoading,
    [`${className}`]: className,
  });

  return (
    <Button
      btnClassNames={btnClassNames}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default ButtonContainer;
