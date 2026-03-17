import React from "react";

export default function Button({ text }) {
  const handleClick = () => {
    alert("Button works! ✅");
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      {text}
    </button>
  );
}
