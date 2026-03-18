import React from "react";
import Header from "./components/Header";
import BackendTest from "./components/BackendTest"; // exact match
import FeatureList from "./components/FeatureList"; // exact match

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      {/* Header */}
      <Header />

      {/* Backend test section */}
      <BackendTest />

      {/* Feature list section */}
      <FeatureList />
    </div>
  );
}
