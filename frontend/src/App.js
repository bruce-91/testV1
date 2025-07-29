import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import GameSimulator from "./components/GameSimulator";
import "./App.css";

function App() {
  return (
    <div className="App min-h-screen bg-slate-900">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GameSimulator />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;