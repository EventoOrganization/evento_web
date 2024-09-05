import { cn } from "@nextui-org/theme";

export default function TchatIcon({
  className,
  pathname,
}: {
  className?: string;
  pathname?: boolean;
}) {
  return (
    <>
      <svg
        width="15"
        height="14"
        viewBox="0 0 15 14"
        fill="none"
        className={cn(
          "w-6 h-6 hover:scale-105 hover:opacity-80 transition-transform duration-200 ease-in-out",
          className,
        )}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.8 6.5C14.8 10 11.4999 12.9 7.3999 12.9C6.66657 12.9 5.93328 12.8333 5.19995 12.7C4.69995 12.9 3.3999 13.5 1.3999 13.8C1.1999 13.8 1.0001 13.6 1.1001 13.5C1.4001 12.7 1.70005 11.7 1.80005 10.7C0.700049 9.59995 0 8.1 0 6.5C0 2.9 3.2999 0 7.3999 0C11.4999 0 14.8 2.9 14.8 6.5ZM4.6001 6.5C4.6001 6 4.19995 5.5 3.69995 5.5C3.19995 5.5 2.80005 6 2.80005 6.5C2.80005 7 3.19995 7.40002 3.69995 7.40002C4.19995 7.40002 4.6001 7 4.6001 6.5ZM8.30005 6.5C8.30005 6 7.8999 5.5 7.3999 5.5C6.8999 5.5 6.5 6 6.5 6.5C6.5 7 6.8999 7.40002 7.3999 7.40002C7.8999 7.40002 8.30005 7 8.30005 6.5ZM11.1001 7.40002C11.6001 7.40002 12 7 12 6.5C12 6 11.6001 5.5 11.1001 5.5C10.6001 5.5 10.2 6 10.2 6.5C10.2 7 10.6001 7.40002 11.1001 7.40002Z"
          fill="url(#paint0_linear_75_7)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.8 6.5C14.8 10 11.4999 12.9 7.3999 12.9C6.66657 12.9 5.93328 12.8333 5.19995 12.7C4.69995 12.9 3.3999 13.5 1.3999 13.8C1.1999 13.8 1.0001 13.6 1.1001 13.5C1.4001 12.7 1.70005 11.7 1.80005 10.7C0.700049 9.59995 0 8.1 0 6.5C0 2.9 3.2999 0 7.3999 0C11.4999 0 14.8 2.9 14.8 6.5ZM4.6001 6.5C4.6001 6 4.19995 5.5 3.69995 5.5C3.19995 5.5 2.80005 6 2.80005 6.5C2.80005 7 3.19995 7.40002 3.69995 7.40002C4.19995 7.40002 4.6001 7 4.6001 6.5ZM8.30005 6.5C8.30005 6 7.8999 5.5 7.3999 5.5C6.8999 5.5 6.5 6 6.5 6.5C6.5 7 6.8999 7.40002 7.3999 7.40002C7.8999 7.40002 8.30005 7 8.30005 6.5ZM11.1001 7.40002C11.6001 7.40002 12 7 12 6.5C12 6 11.6001 5.5 11.1001 5.5C10.6001 5.5 10.2 6 10.2 6.5C10.2 7 10.6001 7.40002 11.1001 7.40002Z"
          className="hidden group-hover:block"
          fill="url(#hoverGradient)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_75_7"
            x1="1.76075e-07"
            y1="-5.01002"
            x2="6.53787"
            y2="14.1021"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={pathname ? "#B127A6" : "#8c8c8c"} />
            <stop offset="1" stopColor={pathname ? "#5973D3" : "#bdbdbd"} />
          </linearGradient>{" "}
          <linearGradient
            id="hoverGradient"
            x1="0.5"
            y1="-5.01002"
            x2="7.40312"
            y2="13.806"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={"#B127A6"} />
            <stop offset="1" stopColor={"#5973D3"} />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}
