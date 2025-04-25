import { cn } from "@/lib/utils";

export default function DiscoverIcon({
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
          d="M14.2998 6.90002C14.2998 10.7 11.1999 13.8 7.3999 13.8C3.5999 13.8 0.5 10.7 0.5 6.90002C0.5 3.10002 3.5999 0 7.3999 0C11.1999 0 14.2998 3.10002 14.2998 6.90002ZM10.2002 3.40002L6.2002 5.19995C6.0002 5.33328 5.83353 5.49995 5.7002 5.69995L3.8999 9.69995C3.6999 10.1 4.2001 10.6 4.6001 10.4L8.6001 8.59998C8.8001 8.46664 8.96676 8.29998 9.1001 8.09998L10.8999 4.09998C11.0999 3.69998 10.6002 3.20002 10.2002 3.40002ZM8 6.30005C8.4 6.60005 8.4 7.2 8 7.5C7.7 7.9 7.0998 7.9 6.7998 7.5C6.3998 7.2 6.3998 6.60005 6.7998 6.30005C7.0998 5.90005 7.7 5.90005 8 6.30005Z"
          fill="url(#paint0_linear_1_4074)"
        />{" "}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.2998 6.90002C14.2998 10.7 11.1999 13.8 7.3999 13.8C3.5999 13.8 0.5 10.7 0.5 6.90002C0.5 3.10002 3.5999 0 7.3999 0C11.1999 0 14.2998 3.10002 14.2998 6.90002ZM10.2002 3.40002L6.2002 5.19995C6.0002 5.33328 5.83353 5.49995 5.7002 5.69995L3.8999 9.69995C3.6999 10.1 4.2001 10.6 4.6001 10.4L8.6001 8.59998C8.8001 8.46664 8.96676 8.29998 9.1001 8.09998L10.8999 4.09998C11.0999 3.69998 10.6002 3.20002 10.2002 3.40002ZM8 6.30005C8.4 6.60005 8.4 7.2 8 7.5C7.7 7.9 7.0998 7.9 6.7998 7.5C6.3998 7.2 6.3998 6.60005 6.7998 6.30005C7.0998 5.90005 7.7 5.90005 8 6.30005Z"
          className="hidden group-hover:block"
          fill="url(#hoverGradient)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1_4074"
            x1="0.5"
            y1="-5.01002"
            x2="7.40312"
            y2="13.806"
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
