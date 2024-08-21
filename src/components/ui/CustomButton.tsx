import { Button, ButtonProps } from '@nextui-org/react';

interface CustomButtonProps extends ButtonProps {
  gradient?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  gradient = false,
  className,
  ...props
}) => {
  const colorClasses = gradient
    ? "bg-gradient-to-tr from-pink-500 to-blue-500 text-white shadow-lg w-40 h-16"
    : "w-40 h-16";

  return (
    <Button
      className={`${colorClasses} ${className}`}
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default CustomButton;
