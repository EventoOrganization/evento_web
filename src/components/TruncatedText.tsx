import { useRef, useState } from "react";

const TruncatedText = ({ text = "" }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const textRef = useRef(null);

  const toggleText = () => setIsExpanded(!isExpanded);

  return (
    <div className=" p-4 text-sm w-full">
      <p
        ref={textRef}
        className={`${isExpanded ? "" : "line-clamp-2"} break-words w-full whitespace-normal`}
      >
        {text}
      </p>
      <div className="w-full flex justify-end items-start">
        <button onClick={toggleText} className="text-blue-500 underline">
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      </div>
    </div>
  );
};

export default TruncatedText;
