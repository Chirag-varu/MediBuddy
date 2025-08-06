import React, { useState } from "react";
import { getDiagnosis } from "../services/huggingFaceAPI";

const SymptomForm = () => {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    const response = await getDiagnosis(symptoms);
    setLoading(false);

    if (response.error) {
      setError(response.error);
    } else {
      setResult(response);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h1 className="text-2xl font-bold text-center text-pink-600 mb-4">🩺 MediBuddy - AI Diagnosis</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          rows="4"
          placeholder="Describe your symptoms: e.g., I have fever, headache, and cough..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition disabled:bg-gray-400"
        >
          {loading ? "Diagnosing..." : "Diagnose"}
        </button>
      </form>

      {/* Error */}
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      {/* Results */}
      {result && !error && (
        <div className="mt-6 space-y-6">
          {/* Diagnosis Table */}
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td className="border p-2 font-semibold w-1/3 bg-gray-100">AI Diagnosis</td>
                <td className="border p-2 text-pink-600 font-bold">{result.diagnosis}</td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold bg-gray-100">⚠ Danger Level</td>
                <td className="border p-2">{result.dangerLevel}</td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold bg-gray-100">⏳ Recovery Time</td>
                <td className="border p-2">{result.recoveryDays}</td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold bg-gray-100">👨‍⚕️ Doctor Needed?</td>
                <td className="border p-2">{result.doctorRequired}</td>
              </tr>
            </tbody>
          </table>

          {/* Common Symptoms */}
          {result.symptoms.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">📋 Common Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {result.symptoms.map((s, i) => (
                  <span key={i} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Medicines */}
          {result.medicine.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">💊 Suggested Medicines</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.medicine.map((med, i) => (
                  <li key={i}>{med}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Non-Medicine Remedies */}
          {result.nonMedicine.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">🌿 Non‑Medicine Remedies</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.nonMedicine.map((rem, i) => (
                  <li key={i}>{rem}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SymptomForm;
