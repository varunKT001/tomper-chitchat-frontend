import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import './css/hamburger.css';
import './css/login.css';
import './css/toggle_switch.css';
import './css/image-modal.css';
import App from './App';
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'https://tomper-chitchat-server.herokuapp.com';
const socket = socketIOClient(ENDPOINT);

ReactDOM.render(
  <React.StrictMode>
    <App socket={socket} />
  </React.StrictMode>,
  document.getElementById('root')
);
