import React from "react";

export default function login_room({ room, setRoom, newUserLogin }) {
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
}
