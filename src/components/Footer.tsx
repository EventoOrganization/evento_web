import Image from "next/image";
import Link from "next/link";
const Footer = () => {
  return (
    <footer className=" w-full flex flex-col justify-center items-center min-h-40 pt-10 pb-20 gap-10 border-t-2 max-w-2xl">
      <ul className="flex flex-wrap justify-center gap-6 w-full max-w-96">
        <li>
          <Link href={"https://www.instagram.com/eventoapp.io/"}>
            <Image
              src={"/Instagram_logo_2022.png"}
              alt="Instagram_logo_2022"
              width={50}
              height={50}
            />
          </Link>
        </li>
        <li>
          <Link
            href={
              "https://open.spotify.com/user/31msifekspkjzjhhedzyywi7nicy?si=8a85e82182bd4d9b"
            }
          >
            <Image
              src={"/spotify.png"}
              alt="spotify_logo"
              width={50}
              height={50}
              className="rounded-lg"
            />
          </Link>
        </li>
        <li>
          <Link href={"https://www.tiktok.com/@eventoapp.io"}>
            <Image
              src={"/tiktok-logo.webp"}
              alt="tiktok_logo"
              width={50}
              height={50}
            />
          </Link>
        </li>
      </ul>
      <div className="grid grid-cols-1 md:flex gap-4 md:gap-10 text-center">
        <Link
          target="_blank"
          href="https://enormous-curler-2a0.notion.site/Welcome-to-Evento-How-it-Works-Guide-1a8c972b8ab481a192a1c7018ab1527d"
        >
          Evento &#039;How-To&#039; Guide
        </Link>
        <Link href="/faq">FAQs</Link>
        <Link href="/terms">Terms & Conditions</Link>
        <Link href="/privacy">Privacy Policy</Link>
        <Link href={"mailto:help@evento-app.io"}>Contact Us</Link>
      </div>
      <Image
        src="/evento-logo.png"
        alt="logo"
        width={60}
        height={60}
        className="object-contain"
        priority
      />
    </footer>
  );
};

export default Footer;
