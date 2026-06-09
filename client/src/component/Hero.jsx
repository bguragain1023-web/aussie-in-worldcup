import { Chatbox } from "./Chatbox";

export const Hero = () => {
  return (
    <>
      <div className="hero">
        <div className="hero-bg"></div>

        <div className="chat-wrapper">
          <Chatbox />
        </div>
      </div>
    </>
  );
};
