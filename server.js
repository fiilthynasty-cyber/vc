import express from "express";
import path from "path";
import cors from "cors";

const app = express();
const __dirname = path.resolve();

// Enable CORS so your frontend can call the backend API
app.use(cors());

// Serve static frontend files from the "dist" folder
app.use(express.static(path.join(__dirname, "dist")));

// Example: Proxy API requests to your live backend
app.use("/api", async (req, res) => {
  try {
    const url = `https://one-shxr.onrender.com${req.originalUrl}`;
    const response = await fetch(url, {
      method: req.method,
      headers: req.headers,
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Backend connection failed" });
  }
});

// Send all other requests to frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
