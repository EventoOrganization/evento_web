import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Paperclip } from "lucide-react";
import { useState } from "react";
interface ChatInputProps {
  onSendMessage: (message: string, file: File | null) => void;
}
const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setFile(file);
    }
  };

  const handleSubmit = () => {
    if (!message && !file) {
      alert("Vous ne pouvez pas envoyer un message vide.");
      return;
    }
    const textMessage = message || (file ? "Fichier joint" : "");
    console.log(textMessage, file);
    onSendMessage(textMessage, file);
    setMessage("");
    setFile(null);
  };

  return (
    <div className="chat-input-container flex items-center w-full gap-6">
      <Label htmlFor="file-upload" className="cursor-pointer absolute ml-3 ">
        <Paperclip name="attachment" className="w-5 h-5 text-gray-500" />
      </Label>
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="pl-12 pr-20"
      />
      <Input
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="file-upload"
      />
      <Button
        onClick={handleSubmit}
        className="absolute right-5 rounded-l-none"
      >
        Send
      </Button>
    </div>
  );
};

export default ChatInput;
