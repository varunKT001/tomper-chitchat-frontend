import React from "react";
import { AiOutlineClose } from "react-icons/ai";

export default function image_view({ image, closeImage }) {
  return (
    <main className="image-modal">
      <button onClick={closeImage}>
        <AiOutlineClose style={{ transform: "translate(0px, 5px)" }} />
      </button>
      <img src={image} alt="user-media" width="100%" />
    </main>
  );
}
