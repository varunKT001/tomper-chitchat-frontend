import React from "react";
import {
  BsChatDotsFill,
  BsFillHouseFill,
  BsFillPersonFill,
} from "react-icons/bs";
import { IoPeopleSharp } from "react-icons/io5";
import { GoPrimitiveDot } from "react-icons/go";

export default function hamburger({
  background,
  changeBackground,
  room,
  users,
  username,
  userLogout,
}) {
  return (
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
              <BsFillPersonFill style={{ transform: "translate(0px, 3px)" }} />
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
  );
}
