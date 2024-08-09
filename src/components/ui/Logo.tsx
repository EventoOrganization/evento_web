import Link from "next/link";
import Image from "next/image";

export default function Logo({
  src,
  children,
}: {
  src: string | null;
  children?: React.ReactNode;
}) {
  return (
    <Link
      href="/"
      aria-label="Back to homepage"
      className="flex items-center p-2 mt-[10px]"
    >
      {src && <Image src={src} alt="logo" width={138} height={45} />}
      <div className="ml-2">{children}</div>
    </Link>
  );
}
