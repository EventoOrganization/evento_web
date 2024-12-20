import Image from "next/image";
import Link from "next/link";
const Footer = () => {
  return (
    <footer className=" w-full flex flex-col justify-center items-center min-h-40 py-10 gap-10">
      <Image
        src="/evento-logo.png"
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
          <Image
            src={"/Instagram_logo_2022.png"}
            alt="Instagram_logo_2022"
            width={50}
            height={50}
          />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
