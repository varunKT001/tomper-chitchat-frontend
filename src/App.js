import React, { useState, useEffect } from "react";
import { GoPrimitiveDot } from "react-icons/go";
import {
  BsChatDotsFill,
  BsFillHouseFill,
  BsMoon,
  BsSun,
  BsArrowRightShort,
  BsFillPersonFill,
} from "react-icons/bs";
import { IoPeopleSharp } from "react-icons/io5";
import { FaTelegramPlane } from "react-icons/fa";

function App({ socket }) {
  const [loggedin, setLoggedIn] = useState(false);
  const [error, setError] = useState(false);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [typing, setTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [background, setBackground] = useState(true);
  const permanentRooms = [
    "General",
    "webDevelopment",
    "competetiveCoding",
    "Gaming",
  ];
  let timeout;

  useEffect(() => {
    setLoggedIn(false);

    socket.on("chat-message", (message) => {
      setTyping(false);
      appendMessages(message);
    });
    socket.on("connected-users", (users) => {
      appendUsers(users);
    });
    socket.on("typing", (typingText) => {
      setTyping(true);
      window.scrollTo(0, document.body.scrollHeight);
      setTypingText(typingText);
      if (timeout !== undefined) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        setTyping(false);
      }, 3000);
    });
  }, []);

  useEffect(() => {
    document.body.className = background ? "dark" : "light";
  }, [background]);

  function newUserLogin(e) {
    setError(false);
    e.preventDefault();
    if (username && room) {
      const info = {
        username,
        room,
      };
      socket.emit("new-user", info);
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
    setUsers(users);
    window.scrollTo(0, document.body.scrollHeight);
  }

  function sendMessage(e) {
    e.preventDefault();
    socket.emit("chat-message", messageText);
    setMessageText("");
  }

  function sendTypingEvent() {
    socket.emit("typing");
  }

  function changeBackground() {
    setBackground(!background);
  }

  if (!loggedin) {
    return (
      <div id="login">
        <div id="login-form-container">
          <form id="login-form" onSubmit={newUserLogin}>
            <h3>
              TOMPER CHAT <BsChatDotsFill />
            </h3>
            <input
              id="login-input"
              className={`${error && "error"}`}
              type="text"
              name="username"
              value={username}
              placeholder="username"
              autoComplete="off"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            {permanentRooms.map((room) => {
              return (
                <div className="rooms">
                  <span>{room}</span>
                  <button
                    type="button"
                    onMouseOver={() => {
                      setRoom(room);
                    }}
                    onClick={(e) => {
                      newUserLogin(e);
                    }}
                  >
                    join
                  </button>
                </div>
              );
            })}
            <h3>---OR---</h3>
            <input
              id="login-input"
              className={`${error && "error"}`}
              type="text"
              name="room"
              value={room}
              placeholder="room id"
              autoComplete="off"
              onChange={(e) => {
                setRoom(e.target.value);
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

          <span
            style={{ background: `${!background ? "#232323" : "#2a93ec"}` }}
          ></span>
          <span
            style={{ background: `${!background ? "#232323" : "#2a93ec"}` }}
          ></span>
          <span
            style={{ background: `${!background ? "#232323" : "#2a93ec"}` }}
          ></span>

          <ul id="menu">
            <li>
              Theme:{" "}
              <div class="container">
                <label class="switch">
                  <input
                    type="checkbox"
                    defaultChecked={background}
                    onChange={changeBackground}
                  />{" "}
                  <div></div>
                </label>
              </div>
            </li>
            <li>
              Room{" "}
              <BsFillHouseFill style={{ transform: "translate(3px, 3px)" }} />
            </li>
            <li className="room-name" style={{ fontWeight: "normal" }}>
              <p style={{ margin: "0", padding: "0.5rem 1rem" }}>
                {room} : {users.length}{" "}
                <BsFillPersonFill
                  style={{ transform: "translate(0px, 3px)" }}
                />
              </p>
            </li>
            <li>
              Online users{" "}
              <IoPeopleSharp style={{ transform: "translate(3px, 3px)" }} />
            </li>
            {users.map((user, index) => {
              return (
                <li
                  className="user-names"
                  key={index}
                  style={{ fontWeight: "normal" }}
                >
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
                    <p className="chat-time">{message.time}</p>
                  </div>
                </li>
              );
            })}
            {typing && (
              <li>
                <div className="message">
                  <h4 className="person-name"></h4>
                  <p
                    className="chat-message"
                    style={{ color: "rgb(0,150,136)", fontWeight: "bold" }}
                  >
                    {typingText}
                  </p>
                </div>
              </li>
            )}
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
              // onKeyPress={() => {
              //   sendTypingEvent();
              // }}
              onChange={(e) => {
                setMessageText(e.target.value);
                sendTypingEvent();
              }}
            />
            <button type="submit">
              <FaTelegramPlane style={{ fontSize: "1.5rem" }} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default App;
