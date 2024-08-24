const GoingIcon = ({
  fill = "#5f6fed",
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
        d="M14.8998 24.0999L9.1 18.3C8.8 18 8.8 17.4 9.1 17L10.3998 15.8C10.6998 15.4 11.3 15.4 11.6 15.8L15.4999 19.6999L23.7997 11.4C24.1997 11 24.7 11 25.1 11.4L26.2997 12.5999C26.6997 12.9999 26.6997 13.5 26.2997 13.9L16.1 24.0999C15.8 24.3999 15.1998 24.3999 14.8998 24.0999Z"
        stroke={fill}
        strokeWidth={strokeWidth}
        strokeMiterlimit="100"
      />
    </svg>
  );
};

export default GoingIcon;