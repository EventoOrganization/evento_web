import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const EventAddTempGuest = ({ onAddTempGuest }: { onAddTempGuest: any }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    const newGuest = { email, username };
    onAddTempGuest(newGuest);
    setEmail("");
    setUsername("");
  };

  return (
    <>
      <h4>
        Add friends who are not yet on Evento by adding their name and email
        address
      </h4>
      <form onSubmit={handleAddGuest} className="flex gap-2">
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Name"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-fit bg-eventoBlue hover:bg-eventoBlue/80"
        >
          Add
        </Button>
      </form>
    </>
  );
};

export default EventAddTempGuest;
