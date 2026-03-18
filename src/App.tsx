import React from "react";
import Header from "./components/Header";
import BackendTest from "./components/BackendTest"; // Make sure filename matches exactly
import FeatureList from "./components/FeatureList";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-black text-white">
      {/* Header */}
      <Header />

      {/* Backend test section */}
      <div className="w-full max-w-3xl my-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
        <BackendTest />
      </div>

      {/* Feature list */}
      <div className="w-full max-w-3xl my-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
        <FeatureList />
      </div>
    </div>
  );
}
