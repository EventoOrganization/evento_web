import { cn } from "@nextui-org/theme";

export default function ProfileIcon({
  className,
  pathname,
}: {
  className?: string;
  pathname?: boolean;
}) {
  return (
    <>
      <svg
        width="13"
        height="14"
        viewBox="0 0 13 14"
        fill="none"
        className={cn(
          "w-6 h-6 hover:scale-105 transition-transform duration-200 ease-in-out",
          className,
        )}
      >
        <path
          d="M6 6.90002C7.9 6.90002 9.5 5.4 9.5 3.5C9.5 1.5 7.9 0 6 0C4.1 0 2.6001 1.5 2.6001 3.5C2.6001 5.4 4.1 6.90002 6 6.90002ZM8.5 7.80005H8C7.4 8.06672 6.73333 8.19995 6 8.19995C5.33333 8.19995 4.7001 8.06672 4.1001 7.80005H3.6001C1.6001 7.80005 0 9.40002 0 11.4V12.5C0 13.2 0.600049 13.8 1.30005 13.8H10.8C11.5 13.8 12.1001 13.2 12.1001 12.5V11.4C12.1001 9.40002 10.5 7.80005 8.5 7.80005Z"
          fill="url(#paint0_linear_75_3)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_75_3"
            x1="1.43954e-07"
            y1="-5.01002"
            x2="7.60166"
            y2="13.1579"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={pathname ? "#B127A6" : "#8c8c8c"} />
            <stop offset="1" stopColor={pathname ? "#5973D3" : "#bdbdbd"} />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}
