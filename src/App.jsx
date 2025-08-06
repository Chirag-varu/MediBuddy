import React from "react";
import SymptomForm from "./components/SymptomForm";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex flex-col items-center py-10 px-4">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-pink-600 drop-shadow-sm mb-6">
          🧠 AI Medical Diagnosis Expert System
        </h1>
        <p className="text-gray-600 mb-10">
          Describe your symptoms and let AI suggest possible conditions, danger
          level, and remedies.  
          <span className="block text-pink-500 font-medium">
            ⚠ Not a replacement for a professional doctor.
          </span>
        </p>
        <SymptomForm />
      </div>
    </div>
  );
};

export default App;
