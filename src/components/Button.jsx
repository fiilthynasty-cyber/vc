import React from "react";

export default function Button({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        background: "black",
        color: "white",
        borderRadius: "8px",
        cursor: "pointer"
      }}
    >
      {children}
    </button>
  );
}
