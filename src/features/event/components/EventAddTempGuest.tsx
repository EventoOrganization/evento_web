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
      <form onSubmit={handleAddGuest}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <button type="submit">Add Temp Guest</button>
      </form>
    </>
  );
};

export default EventAddTempGuest;
