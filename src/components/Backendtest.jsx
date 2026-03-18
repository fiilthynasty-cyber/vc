import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Backendtest() {
  const [status, setStatus] = useState("Connecting…");

  useEffect(() => {
    supabase
      .from("your_table") // replace with a real table in your Supabase project
      .select("*")
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          setStatus("Error connecting to backend");
        } else {
          setStatus("Connected successfully!");
        }
      });
  }, []);

  return <div className="text-center p-4">{status}</div>;
}
