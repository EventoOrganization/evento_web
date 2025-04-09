import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const EventAddTempGuest = ({ onAddTempGuest }: { onAddTempGuest: any }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    const newGuest = { email, username };
    console.log("newGuest", newGuest);
    onAddTempGuest(newGuest);
    setEmail("");
    setUsername("");
  };

  return (
    <>
      <h4 className="pt-4 pb-2 w-full">
        Invite friends who are not yet on Evento by adding their name and email
        address
      </h4>
      <form onSubmit={handleAddGuest} className="flex gap-2 w-full">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Name"
            required
          />{" "}
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <Button type="submit" variant={"eventoPrimary"} className="w-fit">
          Add
        </Button>
      </form>
    </>
  );
};

export default EventAddTempGuest;
