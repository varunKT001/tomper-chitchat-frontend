import React, { useState, useEffect } from "react";
import { GoPrimitiveDot } from "react-icons/go";
import {
  BsChatDotsFill,
  BsFillHouseFill,
  BsFillPersonFill,
} from "react-icons/bs";
import { IoPeopleSharp } from "react-icons/io5";
import { FaTelegramPlane } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { BiImageAdd } from "react-icons/bi";
import { GrStatusGood } from "react-icons/gr";
import Spinner from "./svg/spinner.svg";
console.log(Spinner);

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
  const [baseImage, setBaseImage] = useState("");
  const [openImage, setOpenImage] = useState(false);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const permanentRooms = [
    "General",
    "webDevelopment",
    "competetiveCoding",
    "Gaming",
  ];
  let timeout;

  useEffect(() => {
    socket.on("chat-message", (message) => {
      setTyping(false);
      setLoading(false);
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

  function userLogout() {
    window.location.reload();
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
    setLoading(true);
    socket.emit("chat-message", { messageText, baseImage });
    setMessageText("");
    setBaseImage("");
  }

  function sendTypingEvent() {
    socket.emit("typing");
  }

  function changeBackground() {
    setBackground(!background);
  }

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertBase64(file);
      const resized_base64 = await process_image(base64);
      setBaseImage(resized_base64);
    }
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  async function reduce_image_file_size(
    base64Str,
    MAX_WIDTH = 450,
    MAX_HEIGHT = 450
  ) {
    let resized_base64 = await new Promise((resolve) => {
      let img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL()); // this will return base64 image results after resize
      };
    });
    return resized_base64;
  }

  async function process_image(res, min_image_size = 500) {
    if (res) {
      const old_size = calc_image_size(res);
      if (old_size > min_image_size) {
        const resized = await reduce_image_file_size(res);
        const new_size = calc_image_size(resized);
        console.log("new_size=> ", new_size, "KB");
        console.log("old_size=> ", old_size, "KB");
        return resized;
      } else {
        console.log("image already small enough");
        return res;
      }
    } else {
      console.log("return err");
      return null;
    }
  }

  function calc_image_size(image) {
    let y = 1;
    if (image.endsWith("==")) {
      y = 2;
    }
    const x_size = image.length * (3 / 4) - y;
    return Math.round(x_size / 1024);
  }

  function showImage(base64string) {
    setOpenImage(true);
    setImage(base64string);
  }
  function closeImage() {
    setOpenImage(false);
    setImage("");
    window.scrollTo(0, document.body.scrollHeight);
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
                <div className="rooms" key={index}>
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

  if (openImage) {
    return (
      <main className="image-modal">
        <button onClick={closeImage}>
          <AiOutlineClose style={{ transform: "translate(0px, 5px)" }} />
        </button>
        <img src={image} alt="user-media" width="100%" />
      </main>
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
            <li className="leave-button" style={{ fontWeight: "normal" }}>
              <p
                style={{ margin: "0", padding: "0.5rem 1rem" }}
                onClick={userLogout}
              >
                Leave room
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
                  <p>
                    {user.name}
                    {user.name === username && " (you)"}
                  </p>
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
                      >
                        {/* <img src={message.image} /> */}
                      </div>
                    )}
                    <p className="chat-time">{message.time}</p>
                  </div>
                </li>
              );
            })}
            {typing && (
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
            )}
            {loading && (
              <li className="user-msg">
                <div className="message user-msg-border">
                  <p className="chat-message">
                    <img
                      src={Spinner}
                      alt="spinner"
                      style={{ width: "5rem" }}
                    />
                  </p>
                </div>
              </li>
            )}
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
