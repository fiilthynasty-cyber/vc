import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xyzcompany.supabase.co";
const supabaseAnonKey = "YOUR_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function BackendTest() {
  const [status, setStatus] = useState("Not tested");

  const testBackend = async () => {
    try {
      const { data, error } = await supabase.from("test").select("*");
      if (error) throw error;
      setStatus("Backend connected! Rows: " + data.length);
    } catch {
      setStatus("Error connecting to backend");
    }
  };

  return (
    <div className="mb-8 text-center">
      <button
        onClick={testBackend}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
      >
        Test Backend Connection
      </button>
      <p className="mt-2 text-lg">{status}</p>
    </div>
  );
}
