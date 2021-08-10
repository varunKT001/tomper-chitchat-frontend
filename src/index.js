import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./hamburger.css";
import "./login.css";
import App from "./App";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
const socket = socketIOClient(ENDPOINT, {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd",
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App socket={socket} />
  </React.StrictMode>,
  document.getElementById("root")
);
