import React, { useState, useEffect } from "react";
import { GoPrimitiveDot } from "react-icons/go";
import { BsChatDotsFill } from "react-icons/bs";
import { IoPeopleSharp } from "react-icons/io5";

function App({ socket }) {
  const [loggedin, setLoggedIn] = useState(false);
  const [error, setError] = useState(false);
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  useEffect(() => {
    setLoggedIn(false);

    socket.on("chat-message", (message) => {
      appendMessages(message);
    });
    socket.on("connected-users", (users) => {
      appendUsers(users);
    });
  }, []);

  function newUserLogin(e) {
    setError(false);
    e.preventDefault();
    if (username) {
      socket.emit("new-user", username);
      setLoggedIn(true);
    } else {
      setError(true);
    }
  }

  function appendMessages(message) {
    setMessages((oldMsg) => {
      let newMsg = [...oldMsg, message];
      return newMsg;
    });
    window.scrollTo(0, document.body.scrollHeight);
  }

  function appendUsers(users) {
    console.log(users);
    setUsers(users);
    window.scrollTo(0, document.body.scrollHeight);
  }

  function sendMessage(e) {
    e.preventDefault();
    socket.emit("chat-message", messageText);
    setMessageText("");
  }

  if (!loggedin) {
    return (
      <div id="login">
        <div id="login-form-container">
          <form id="login-form" onSubmit={newUserLogin}>
            <h3>
              VARTA <BsChatDotsFill />
            </h3>
            <input
              id="login-input"
              className={`${error && "error"}`}
              type="text"
              value={username}
              placeholder="username"
              autoComplete="off"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <button type="submit">join</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <main>
      <nav role="navigation">
        <div id="menuToggle">
          <input type="checkbox" />

          <span></span>
          <span></span>
          <span></span>

          <ul id="menu">
            <li>
              Online users{" "}
              <IoPeopleSharp style={{ transform: "translate(3px, 3px)" }} />
            </li>
            {users.map((user, index) => {
              return (
                <li className="user-names" key={index}>
                  <p>{user.name}</p>
                  <GoPrimitiveDot className="online-icon" />
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
      <section className="form-section">
        <div id="messages">
          <ul>
            {messages.map((message, index) => {
              return (
                <li
                  key={index}
                  className={`${message.username === username && "user-msg"}`}
                >
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
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <form id="form" onSubmit={sendMessage}>
            <input
              id="input"
              type="text"
              autoFocus
              value={messageText}
              autoComplete="off"
              onChange={(e) => {
                setMessageText(e.target.value);
              }}
            />
            <button type="submit">send</button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default App;
