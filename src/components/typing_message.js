import React from "react";

export default function typing({ typingText }) {
  return (
    <li>
      <div className="message">
        <p
          className="chat-message"
          style={{ color: "rgb(0,150,136)", fontWeight: "bold" }}
        >
          {typingText}
        </p>
      </div>
    </li>
  );
}
