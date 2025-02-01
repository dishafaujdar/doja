import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const messageListener = (data: { message: string }) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    socket.on("receive_message", messageListener);

    return () => {
      socket.off("receive_message", messageListener); // Correct cleanup
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("send_message", { message });
      setMessage(""); // Clear input after sending
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>

      <div>
        <h3>Messages:</h3>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
