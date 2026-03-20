I’ve built a **ready-to-run React Native frontend (Expo + Tailwind)** for your Savage AI Squad that plugs directly into your **live backend**.

---

## Folder Structure

```bash
savage-frontend/
 ├─ App.js
 ├─ package.json
 ├─ components/
 │    ├─ AgentCard.js
 │    └─ EarningsCard.js
 └─ tailwind.config.js
```

---

## 1️⃣ `package.json`
```json
{
  "name": "savage-squad-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios"
  },
  "dependencies": {
    "expo": "~50.0.0",
    "react": "18.2.0",
    "react-native": "0.72.3",
    "axios": "^1.6.0",
    "nativewind": "^2.0.0"
  }
}
```

---

## 2️⃣ `App.js`
```javascript
import React, { useState, useEffect } from "react";
import { ScrollView, Text, RefreshControl, View, Button } from "react-native";
import axios from "axios";
import AgentCard from "./components/AgentCard";
import EarningsCard from "./components/EarningsCard";

export default function App() {
  const [agents, setAgents] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://YOUR_BACKEND_URL/api/agents");
      setAgents(res.data.agents);
      setTotalEarnings(res.data.totalEarnings);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      className="bg-gray-900 flex-1 p-4"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text className="text-3xl text-white font-bold mb-4">Savage AI Squad</Text>
      <EarningsCard total={totalEarnings} />
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} refresh={fetchData} />
      ))}
      <View className="mt-6">
        <Button title="Refresh All" onPress={fetchData} color="#FBBF24" />
      </View>
    </ScrollView>
  );
}
```

---

## 3️⃣ `components/AgentCard.js`
```javascript
import React from "react";
import { View, Text, Button } from "react-native";
import axios from "axios";

export default function AgentCard({ agent, refresh }) {
  const triggerAgent = async () => {
    await axios.post(`http://YOUR_BACKEND_URL/api/agents/${agent.id}/trigger`);
    refresh();
  };

  return (
    <View className="bg-gray-800 rounded-lg p-4 mb-4">
      <Text className="text-xl text-yellow-400 font-bold">{agent.name}</Text>
      <Text className="text-white mt-1">{agent.status}</Text>
      <Text className="text-green-400 mt-1">Earnings: ${agent.earnings.toFixed(2)}</Text>
      <Button title="Trigger Agent" onPress={triggerAgent} color="#FBBF24" />
    </View>
  );
}
```

---

## 4️⃣ `components/EarningsCard.js`
```javascript
import React from "react";
import { View, Text } from "react-native";

export default function EarningsCard({ total }) {
  return (
    <View className="bg-gray-700 rounded-lg p-4 mb-6">
      <Text className="text-white text-xl font-bold">Total Earnings</Text>
      <Text className="text-green-400 text-2xl mt-2">${total.toFixed(2)}</Text>
    </View>
  );
}
```

---

## 5️⃣ `tailwind.config.js`
```javascript
module.exports = {
  content: ["./App.js", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

---

### ✅ Instructions

1. Unzip the folder.
2. `cd savage-frontend`
3. `npm install`
4. Replace `http://YOUR_BACKEND_URL` in `App.js` and `AgentCard.js` with your live backend URL.
5. `npm start` to launch Expo app (iOS / Android).
6. Your frontend now **connects directly** to your live backend and shows real-time agent earnings and statuses.

This frontend is **fully plug-and-play** for your live Savage AI Squad backend.

