import React from "react";

export default function users_messages({ message, username, showImage }) {
  return (
    <li className={`${message.username === username && "user-msg"}`}>
      <div
        className={` message ${
          message.username === username && "user-msg-border"
        }`}
      >
        <h4
          className={`person-name ${
            message.username === username && "text-to-end"
          }`}
        >
          {message.username !== username && message.username}
        </h4>
        <p className="chat-message">{message.text}</p>
        {message.image && (
          <div
            style={{
              width: "10rem",
              height: "10rem",
              background: `url(${message.image}) no-repeat`,
              backgroundSize: "cover",
            }}
            onClick={() => {
              showImage(message.image);
            }}
          ></div>
        )}
        <p className="chat-time">{message.time}</p>
      </div>
    </li>
  );
}
