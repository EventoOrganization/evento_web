const CalendarIcon = ({
  fill = "white",
  strokeWidth = 2,
  className = "",
  ...props
}) => {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect
        x="4"
        y="6"
        width="26"
        height="24"
        rx="3"
        stroke={fill}
        strokeWidth={strokeWidth}
        strokeMiterlimit="100"
      />
      <line
        x1="9"
        y1="2"
        x2="9"
        y2="7"
        stroke={fill}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <line
        x1="25"
        y1="2"
        x2="25"
        y2="7"
        stroke={fill}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <line
        x1="4"
        y1="12"
        x2="30"
        y2="12"
        stroke={fill}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default CalendarIcon;
