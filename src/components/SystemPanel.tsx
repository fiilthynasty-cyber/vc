import React, { useEffect, useState } from "react";

export default function SystemPanel() {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(Math.random() > 0.2 ? "✅ All systems normal" : "⚠️ Minor issues detected");
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono-tech text-green-400">
      <p>{status}</p>
    </div>
  );
}
