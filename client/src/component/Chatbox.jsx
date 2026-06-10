import { useState } from "react";
import { queryAPI } from "../api/axios.js";

export const Chatbox = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSend = async () => {
    if (!input.trim()) return;
    const userMessages = { role: "user", content: input };
    const updatedMessages = [...messages, userMessages];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const data = await queryAPI(input, messages);

      const aiMessage = {
        role: "assistant",
        content: data.responses.response,
        source: data.responses.source,
      };
      setMessages([...updatedMessages, aiMessage]);
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="chat-wrapper ">
      <div className="message-area ">
        {messages.length === 0 && (
          <p className="empty-chat"> Ask anythink about Socceroos</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <p>{msg.content}</p>
            {msg.sources && msg.sources.length > 0 && (
              <small className="sources">source: {msg.sources.join(",")}</small>
            )}
          </div>
        ))}

        {loading && (
          <div className="message assistant">
            <p>Analysing... ⚽</p>
          </div>
        )}
      </div>

      <div className="query-box d-flex align-items-center">
        <input
          type="text"
          className="query-section"
          value={input}
          placeholder="Ask about socceroos"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
        />
        <button className="send-box " onClick={onSend}>
          <i className="bi bi-send "></i>
        </button>
      </div>
    </div>
  );
};
