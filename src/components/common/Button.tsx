import React from 'react';

import { ButtonComponentProps } from 'models/CommonModel';

const Button = ({
  btnClassNames,
  disabled,
  onClick,
  children,
  ...rest
}: ButtonComponentProps): JSX.Element => (
  <button
    className={btnClassNames}
    type="button"
    disabled={disabled}
    onClick={onClick}
    {...rest}
  >
    <span className="btn__text">{children}</span>
  </button>
);

export default Button;
