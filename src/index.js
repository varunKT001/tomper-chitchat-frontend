import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./hamburger.css";
import "./login.css";
import App from "./App";
import socketIOClient from "socket.io-client";

const ENDPOINT = "https://tomper-chat-server.herokuapp.com/";
const socket = socketIOClient(ENDPOINT);

ReactDOM.render(
  <React.StrictMode>
    <App socket={socket} />
  </React.StrictMode>,
  document.getElementById("root")
);
