"use client";
import { cn } from "@nextui-org/theme";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "./ui/button";

const ChatbotComponent = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      console.log("Sending message:", message);
      setMessage(""); // Effacer le message après envoi
    }
  };

  // Fonction pour ajuster la hauteur du textarea
  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Envoyer le message en appuyant sur "Entrée" sans la touche Shift
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={cn(
        "z-50  fixed bottom-0 right-0 w-fit md:bottom-6 md:right-6",
        className,
        { "w-full md:w-fit": isOpen },
      )}
    >
      {/* Bouton pliable */}
      <div
        className={cn(
          "flex flex-col items-center bg-eventoPurpleLight text-white rounded-l-lg md:rounded-xl py-2 md:px-2 cursor-pointer shadow-lg ",
          { "px-2 rounded-bl-none rounded-tr-lg": isOpen },
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center w-full justify-between">
          <Image
            src="/chatbot-icon.png"
            alt="Chatbot Icon"
            className={cn(isOpen ? "block" : "hidden md:block")}
            width={80}
            height={80}
          />
          {isOpen ? (
            <>
              <p className="">
                Report bugs or <br className="hidden" />
                make suggestions
              </p>
              <ChevronDown className="w-5 h-5 ml-2 rotate-90" />
            </>
          ) : (
            <ChevronUp className="w-5 h-5 ml-2 -rotate-90" />
          )}
        </div>

        {/* Zone de texte visible lorsque le chatbot est ouvert */}
        {isOpen && (
          <div className=" w-full flex flex-col gap-2">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded-full border-2 border-none focus:outline-none  focus:black placeholder:text-gray-600"
              placeholder="Type here..."
              rows={1}
              style={{ resize: "none", maxHeight: "150px", overflowY: "auto" }}
              onClick={(e) => e.stopPropagation()}
            />
            <Button onClick={handleSendMessage} className=" self-end w-fit">
              Send
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotComponent;
