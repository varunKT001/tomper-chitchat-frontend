import React, { useState, useEffect } from "react";

/* --- IMPORTING ICONS --- */
import { BsChatDotsFill } from "react-icons/bs";
import { FaTelegramPlane } from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi";
import { GrStatusGood } from "react-icons/gr";

/* --- IMPORTING COMPONENTS --- */
import LoginRoom from "./components/login_room";
import ImageView from "./components/image_view";
import Hamburger from "./components/hamburger";
import UsersMessage from "./components/users_messages";
import TypingMessage from "./components/typing_message";
import LoadingSpinner from "./components/loading_spinner";

/* --- IMPORTING UTILITY FUNCTIONS --- */
import compressImage from "./funtions/image_compression";

function App({ socket }) {
  /* --- STATES --- */
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
  const [baseImage, setBaseImage] = useState("");
  const [openImage, setOpenImage] = useState(false);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  /* --- LOCAL VARIABLES --- */
  const permanentRooms = [
    "General",
    "webDevelopment",
    "competetiveCoding",
    "Gaming",
  ];
  let timeout;

  /* --- SETTING UP SOCKET EVENT LISTNERS --- */
  useEffect(() => {
    socket.on("chat-message", (message) => {
      setTyping(false);
      setUsername((oldUsername) => {
        if (message.username === oldUsername) {
          setLoading(false);
        }
        return oldUsername;
      });
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

  /* --- BACKGROUND SETUP --- */
  useEffect(() => {
    document.body.className = background ? "dark" : "light";
  }, [background]);

  /* --- AUTO SCROLL --- */
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  /* --- USER LOGIN --- */
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

  function userLogout() {
    window.location.reload();
  }

  /* --- MESSAGES FUNCTIONS --- */
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
    setLoading(true);
    socket.emit("chat-message", { messageText, baseImage });
    setMessageText("");
    setBaseImage("");
  }

  function sendTypingEvent() {
    socket.emit("typing");
  }

  /* --- BACKGROUND CHANGE --- */
  function changeBackground() {
    setBackground(!background);
  }

  /* --- IMAGE MODAL --- */
  function showImage(base64string) {
    setOpenImage(true);
    setImage(base64string);
  }
  function closeImage() {
    setOpenImage(false);
    setImage("");
    window.scrollTo(0, document.body.scrollHeight);
  }

  /* --- IMAGE UPLOAD --- */
  async function uploadImage(e) {
    const file = e.target.files[0];
    const resized_base64 = await compressImage(file);
    setBaseImage(resized_base64);
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
            {permanentRooms.map((room, index) => {
              return (
                <LoginRoom
                  key={index}
                  room={room}
                  setRoom={setRoom}
                  newUserLogin={newUserLogin}
                />
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

  if (openImage) {
    return <ImageView image={image} closeImage={closeImage} />;
  }

  return (
    <main>
      <Hamburger
        background={background}
        changeBackground={changeBackground}
        room={room}
        users={users}
        username={username}
        userLogout={userLogout}
      />
      <section className="form-section">
        <div id="messages">
          <ul>
            {messages.map((message, index) => {
              return (
                <UsersMessage
                  message={message}
                  username={username}
                  showImage={showImage}
                />
              );
            })}
            {typing && <TypingMessage typingText={typingText} />}
            {loading && <LoadingSpinner />}
          </ul>
        </div>
        <div>
          <form id="form" onSubmit={sendMessage}>
            <label
              htmlFor="file-upload"
              id="upload-button"
              style={{ background: `${baseImage && "#93D976"}` }}
            >
              {baseImage ? <GrStatusGood /> : <BiImageAdd />}
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                uploadImage(e);
              }}
            />
            <input
              id="input"
              type="text"
              autoFocus
              value={messageText}
              autoComplete="off"
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
