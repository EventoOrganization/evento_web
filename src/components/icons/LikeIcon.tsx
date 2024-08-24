const LikeIcon = ({
  fill = "#D52FC8",
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
        d="M22.8998 12C21.2998 10.6 18.7997 10.9 17.2997 12.4L16.7997 13L16.2001 12.4C14.7001 10.9 12.2 10.6 10.6 12C8.70003 13.6 8.59974 16.5 10.2997 18.2L16.1 24.2C16.5 24.6 17.0998 24.6 17.3998 24.2L23.2001 18.2C24.9001 16.5 24.7998 13.6 22.8998 12Z"
        stroke={fill}
        strokeWidth={strokeWidth}
        strokeMiterlimit="100"
      />
    </svg>
  );
};

export default LikeIcon;