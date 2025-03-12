import { cn } from "@/lib/utils";
import SmartImage from "./SmartImage";
const EventoLoader = ({ full }: { full?: boolean }) => {
  return (
    <>
      <div
        className={cn("flex justify-center items-center", {
          "h-full w-full": full,
        })}
      >
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 flex items-center justify-center w-20 h-20 animate-smooth-spin">
            <SmartImage
              src="/evento-logo.png"
              alt="logo"
              width={50}
              height={50}
              forceImg
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventoLoader;
