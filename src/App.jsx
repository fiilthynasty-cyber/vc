import React from "react";
import Header from "./components/Header";
import BackendTest from "./components/BackendTest";
import FeatureList from "./components/FeatureList";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <Header />
      <BackendTest />
      <FeatureList />
    </div>
  );
}
