import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // Make sure this exists

export default function BackendTest() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("test_table").select("*");
      if (error) setError(error.message);
      else setData(data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="font-orbitron text-sm neon-green mb-2">Backend Test</h2>
      {error ? <p className="text-red-500">{error}</p> : <pre className="font-mono-tech">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
