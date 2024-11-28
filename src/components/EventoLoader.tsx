import Image from "next/image";
const EventoLoader = () => {
  return (
    <>
      <div className="flex justify-center items-center ">
        {/* Main Loader Container */}
        <div className="relative w-20 h-20">
          {/* Outer Rotating Ring */}
          {/* <div className="absolute bg-red-500 inset-0 border-4 border-t-purple-500 border-r-blue-500 border-transparent rounded-full animate-smooth-spin"></div> */}

          {/* Inner Wavy Rotating Gradient */}
          <div className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-smooth-wavy"></div>

          {/* Centered "E" */}
          <div className="absolute inset-0 flex items-center justify-center w-20 h-20 animate-smooth-spin">
            <Image
              src="/logoNoBackground.png"
              alt="logo"
              width={50}
              height={50}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventoLoader;
