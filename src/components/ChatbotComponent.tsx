"use client";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { ChevronDown, ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import SmartImage from "./SmartImage";
import { Button } from "./ui/button";

const ChatbotComponent = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { token } = useSession();
  const { toast } = useToast();
  const handleSendMessage = async () => {
    if (message.trim() === "") {
      toast({ description: "Please enter a message", className: "bg-red-500" });
      return;
    }
    try {
      const body = {
        feedback: `Feedback from page: ${pathname} - ${message}`,
      };
      const res = await fetchData<any>(
        "/ia/feedbacks/submit",
        HttpMethod.POST,
        body,
        token,
      );
      if (res.status) {
        toast({
          title: "Thank you for your feedback!",
          description: "Message sent successfully",
          className: "bg-evento-gradient text-white",
          duration: 3000,
        });
        setMessage("");
        setIsOpen(false);
      } else {
        toast({
          description: "Failed to send message",
          className: "bg-red-500 text-white",
          duration: 3000,
        });
      }
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
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
  if (pathname.startsWith("/chat")) return null;
  return (
    <div
      className={cn(
        "z-30 fixed bottom-0 right-0 w-fit md:bottom-6 md:right-6",
        className,
        { "w-full md:w-fit": isOpen, hidden: !token },
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
          <SmartImage
            src="/chatbot-icon.png"
            alt="Chatbot Icon"
            className={cn(
              isOpen ? "block" : "hidden md:block",
              "object-contain  w-12 h-12",
            )}
            width={40}
            height={40}
            forceImg
          />

          {isOpen ? (
            <>
              <p className="text-sm md:text-base">
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
          <div className=" w-full flex flex-col gap-2 px-2">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded-full border-2 border-none focus:outline-none  focus:black placeholder:text-gray-600 text-sm md:text-base"
              placeholder="Type here..."
              rows={1}
              style={{ resize: "none", maxHeight: "150px", overflowY: "auto" }}
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              onClick={handleSendMessage}
              className=" self-end w-fit mb-2"
            >
              Send
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotComponent;
