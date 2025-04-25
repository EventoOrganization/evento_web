import { cn } from "@/lib/utils";

export default function CreateEventIcon({
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
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        className={cn(
          "w-6 h-6 hover:scale-105 hover:opacity-80 transition-transform duration-200 ease-in-out",
          className,
        )}
      >
        <path
          d="M13.2998 5.90002H8.8999V1.5C8.8999 0.9 8.3999 0.5 7.8999 0.5H6.8999C6.3999 0.5 5.8999 0.9 5.8999 1.5V5.90002H1.5C0.9 5.90002 0.5 6.40002 0.5 6.90002V7.90002C0.5 8.40002 0.9 8.90002 1.5 8.90002H5.8999V13.3C5.8999 13.9 6.3999 14.3 6.8999 14.3H7.8999C8.3999 14.3 8.8999 13.9 8.8999 13.3V8.90002H13.2998C13.8998 8.90002 14.2998 8.40002 14.2998 7.90002V6.90002C14.2998 6.40002 13.8998 5.90002 13.2998 5.90002Z"
          fill="url(#paint0_linear_1_6454)"
        />
        <path
          d="M13.2998 5.90002H8.8999V1.5C8.8999 0.9 8.3999 0.5 7.8999 0.5H6.8999C6.3999 0.5 5.8999 0.9 5.8999 1.5V5.90002H1.5C0.9 5.90002 0.5 6.40002 0.5 6.90002V7.90002C0.5 8.40002 0.9 8.90002 1.5 8.90002H5.8999V13.3C5.8999 13.9 6.3999 14.3 6.8999 14.3H7.8999C8.3999 14.3 8.8999 13.9 8.8999 13.3V8.90002H13.2998C13.8998 8.90002 14.2998 8.40002 14.2998 7.90002V6.90002C14.2998 6.40002 13.8998 5.90002 13.2998 5.90002Z"
          className="hidden group-hover:block"
          fill="url(#hoverGradient)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1_6454"
            x1="-0.881981"
            y1="-3.487"
            x2="7.40308"
            y2="14.3059"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={pathname ? "#B127A6" : "#8c8c8c"} />
            <stop offset="1" stopColor={pathname ? "#5973D3" : "#bdbdbd"} />
          </linearGradient>
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
