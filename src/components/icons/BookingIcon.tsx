const BookingIcon = ({
  fill = "#5f6fed",
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
      <path
        d="M13.25 7C11.464 7 10 8.46403 10 10.25V25.25C10 25.3881 10.0382 25.5234 10.1102 25.6412C10.1822 25.7589 10.2854 25.8545 10.4083 25.9175C10.5312 25.9804 10.669 26.0081 10.8067 25.9977C10.9444 25.9873 11.0765 25.9391 11.1885 25.8584L17 21.6738L22.8115 25.8584C22.9235 25.9391 23.0557 25.9873 23.1933 25.9977C23.331 26.0081 23.4688 25.9804 23.5917 25.9175C23.7146 25.8545 23.8177 25.7589 23.8898 25.6412C23.9618 25.5234 24 25.3881 24 25.25V10.25C24 8.46403 22.536 7 20.75 7H13.25ZM13.25 8.5H20.75C21.725 8.5 22.5 9.27497 22.5 10.25V23.7861L17.4385 20.1416C17.3108 20.0496 17.1574 20.0001 17 20.0001C16.8426 20.0001 16.6892 20.0496 16.5615 20.1416L11.5 23.7861V10.25C11.5 9.27497 12.275 8.5 13.25 8.5Z"
        fill={fill}
        stroke={fill}
      />
      <path
        d="M17 1C25.8 1 33 8.1 33 16.9999C33 25.7999 25.8 32.9999 17 32.9999C8.2 32.9999 1 25.7999 1 16.9999C1 8.1 8.2 1 17 1Z"
        stroke={fill}
        strokeWidth={strokeWidth}
        strokeMiterlimit="100"
      />
    </svg>
  );
};

export default BookingIcon;
