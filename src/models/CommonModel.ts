export type ButtonContainerProps = {
  className?: string;
  btnType?: string;
  children?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export type ButtonComponentProps = {
  btnClassNames: string;
  children: string;
  disabled: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};
