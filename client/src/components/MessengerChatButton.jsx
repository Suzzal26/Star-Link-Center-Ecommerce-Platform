import React from "react";
import { FaFacebookMessenger } from "react-icons/fa";
import "./MessengerChatButton.css";

const MessengerChatButton = () => {
  const handleClick = () => {
    window.open(
      "https://www.facebook.com/messages/t/1025389537612946",
      "_blank"
    );
  };

  return (
    <button
      className="messenger-chat-btn"
      onClick={handleClick}
      title="Chat with us on Messenger"
    >
      <FaFacebookMessenger size={32} />
    </button>
  );
};

export default MessengerChatButton;
