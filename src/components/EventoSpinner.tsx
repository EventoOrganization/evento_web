import SmartImage from "./SmartImage";
const EventoSpinner = () => {
  return (
    <SmartImage
      src="/icon.png"
      alt="logo"
      width={16}
      height={16}
      className="animate-spin"
      forceImg
    />
  );
};

export default EventoSpinner;
