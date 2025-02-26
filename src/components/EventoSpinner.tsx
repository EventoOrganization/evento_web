import Image from "next/image";
const EventoSpinner = () => {
  return (
    <Image
      src="/icon.png"
      alt="logo"
      width={16}
      height={16}
      className="animate-spin"
    />
  );
};

export default EventoSpinner;
