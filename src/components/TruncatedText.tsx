import { useState } from "react";

const TruncatedText = ({ text = "" }: { text?: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <p className={`text-sm ${!isExpanded ? "truncate-2-lines" : ""}`}>
        {text}
      </p>
      {text.length > 100 && (
        <button
          className="text-blue-500 underline"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
};

export default TruncatedText;
