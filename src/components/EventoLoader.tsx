import { cn } from "@/lib/utils";
import Image from "next/image";
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
            <Image src="/evento-logo.png" alt="logo" width={50} height={50} />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventoLoader;
