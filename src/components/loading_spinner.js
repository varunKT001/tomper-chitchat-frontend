import React from "react";
import Spinner from "../svg/spinner.svg";

export default function loading_spinner() {
  return (
    <li className="user-msg">
      <div className="message user-msg-border">
        <p className="chat-message">
          <img src={Spinner} alt="spinner" style={{ width: "5rem" }} />
        </p>
      </div>
    </li>
  );
}
