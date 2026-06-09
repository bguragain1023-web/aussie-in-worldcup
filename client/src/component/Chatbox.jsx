import { useState } from "react";

export const Chatbox = () => {
  const [input, setInput] = useState([]);
  return (
    <div className="chat d-flex justify-content-center align-items-center flex-column gap-2">
      <div className="message-area "></div>

      <div className="query-box d-flex">
        <input
          type="text"
          className="query-section"
          value={input}
          placeholder="Ask about socceroos"
          onChange={(e) => setInput(e.target.value)}
        />
        <i class="bi bi-send"></i>
      </div>
    </div>
  );
};
