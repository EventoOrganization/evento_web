import Image from "next/image";
import Link from "next/link";
import InstagramIcon from "./icons/InstagramIcon";
const Footer = () => {
  return (
    <footer className=" w-full flex flex-col justify-center items-center min-h-40 py-10 gap-10">
      <Image
        src="/icon-128x128.png"
        alt="logo"
        width={128}
        height={128}
        className="object-contain"
        priority
      />
      <div className="grid grid-cols-1 md:flex gap-10 text-center">
        <Link href="/faq">FAQs</Link>
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms & Conditions</Link>
      </div>
      <div>
        <Link href={"https://www.instagram.com/eventoapp.io/"}>
          <InstagramIcon />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
