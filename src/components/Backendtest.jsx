import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // import the client

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
      <h2>Backend Test</h2>
      {error ? <p>Error: {error}</p> : <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
