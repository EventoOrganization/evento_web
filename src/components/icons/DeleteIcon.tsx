const DeleteIcon = ({
  fill = "#B2B2B2",
  strokeWidth = 2,
  className = "",
  ...props
}) => {
  return (
    <svg
      width="34"
      height="35"
      viewBox="0 0 34 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M17 1.80005C25.8 1.80005 33 8.90005 33 17.8C33 26.6 25.8 33.8 17 33.8C8.2 33.8 1 26.6 1 17.8C1 8.90005 8.2 1.80005 17 1.80005Z"
        stroke={fill}
        strokeWidth={strokeWidth}
        strokeMiterlimit="100"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.2002 14.9V24.4C22.2002 24.9 21.7998 25.3 21.2998 25.3H12.7002C12.2002 25.3 11.7998 24.9 11.7998 24.4V14.9H22.2002ZM14.6001 16.8H13.7002V23.4H14.6001V16.8ZM16.5 16.8H15.6001V23.5H16.5V16.8ZM18.3999 16.8H17.3999V23.4H18.3999V16.8ZM20.2998 16.8H19.2998V23.4H20.2998V16.8ZM23.1001 12.8V14H10.7998V12.8C10.7998 12.4 11.1 12.1 11.5 12.1H14.6001V10.9C14.6001 10.5 14.8998 10.2 15.2998 10.2H18.6001C19.0001 10.2 19.2998 10.5 19.2998 10.9V12.1H22.3999C22.7999 12.1 23.1001 12.4 23.1001 12.8ZM18.3999 11.2H15.6001V12.1H18.3999V11.2Z"
        fill={fill}
      />
    </svg>
  );
};

export default DeleteIcon;