import axios from "axios";

const API_URL =
  "https://api-inference.huggingface.co/models/deepset/roberta-base-squad2";
const HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

if (!HF_API_KEY) {
  console.error(
    "❌ Hugging Face API key is missing. Add VITE_HUGGINGFACE_API_KEY to your .env file."
  );
}

const headers = {
  Authorization: `Bearer ${HF_API_KEY}`,
};

export const getDiagnosis = async (symptomInput) => {
  const question = `Based on these symptoms: ${symptomInput}, what possible disease or condition could be causing them? Respond only with the most likely disease name.`;

  const context = `
Fever, cough, body aches → Influenza (flu), COVID-19, Pneumonia  
Fever, sore throat, swollen tonsils → Strep throat, Tonsillitis  
Runny nose, sneezing, mild fever → Common cold, Allergic rhinitis  
Nausea, vomiting, diarrhea → Food poisoning, Gastroenteritis  
Chest pain, breathing difficulty → Pneumonia, COVID-19, Asthma attack  
Loss of taste or smell → COVID-19  
`;

  try {
    const response = await axios.post(
      API_URL,
      { inputs: { question, context } },
      { headers }
    );

    const diagnosis = response.data?.answer || "Unable to determine diagnosis.";

    // Match to local medical database
    const details = getMedicalDetails(diagnosis);

    return { diagnosis, ...details };
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return { error: error.response?.data?.error || "AI diagnosis failed" };
  }
};

// Local knowledge base for common illnesses
// Map of illnesses with multiple possible keywords
const medicalDB = {
  influenza: {
    keywords: ["influenza", "flu"],
    dangerLevel: "Moderate",
    recoveryDays: "5-10 days",
    doctorRequired: "If high fever > 3 days or breathing difficulty",
    symptoms: ["Fever", "Cough", "Body aches", "Fatigue", "Sore throat"],
    medicine: ["Paracetamol for fever", "Cough syrup if needed"],
    nonMedicine: [
      "Rest well",
      "Drink warm fluids",
      "Gargle with warm salt water",
    ],
  },
  covid: {
    keywords: ["covid", "covid-19", "coronavirus"],
    dangerLevel: "Varies (Mild to Severe)",
    recoveryDays: "7-14 days",
    doctorRequired: "Yes if symptoms worsen, oxygen level < 94%",
    symptoms: [
      "Fever",
      "Dry cough",
      "Loss of taste/smell",
      "Fatigue",
      "Breathing difficulty",
    ],
    medicine: ["Paracetamol", "Doctor-prescribed antivirals if severe"],
    nonMedicine: ["Isolate", "Steam inhalation", "Stay hydrated"],
  },
  "common cold": {
    keywords: ["common cold", "cold"],
    dangerLevel: "Mild",
    recoveryDays: "3-7 days",
    doctorRequired: "Only if symptoms persist > 10 days",
    symptoms: [
      "Runny nose",
      "Sneezing",
      "Sore throat",
      "Mild cough",
      "Low-grade fever",
    ],
    medicine: ["Antihistamines (Cetirizine)", "Nasal spray if congested"],
    nonMedicine: ["Warm fluids", "Rest", "Steam inhalation"],
  },
  "strep throat": {
    keywords: ["strep throat", "streptococcal"],
    dangerLevel: "Moderate",
    recoveryDays: "7-10 days",
    doctorRequired: "Yes, needs antibiotics",
    symptoms: [
      "Severe sore throat",
      "Fever",
      "Swollen tonsils",
      "Pain swallowing",
    ],
    medicine: ["Doctor-prescribed antibiotics", "Pain relievers"],
    nonMedicine: ["Warm salt water gargle", "Drink soothing teas"],
  },
  pneumonia: {
    keywords: ["pneumonia"],
    dangerLevel: "Severe",
    recoveryDays: "2-4 weeks",
    doctorRequired: "Yes, immediate medical care",
    symptoms: [
      "High fever",
      "Chest pain",
      "Breathing difficulty",
      "Cough with mucus",
    ],
    medicine: ["Doctor-prescribed antibiotics", "Cough medicine if needed"],
    nonMedicine: ["Rest", "Hydration", "Hospitalization if severe"],
  },
  tonsillitis: {
    keywords: ["tonsillitis"],
    dangerLevel: "Mild to Moderate",
    recoveryDays: "5-7 days",
    doctorRequired: "Yes if bacterial (needs antibiotics)",
    symptoms: ["Sore throat", "Swollen tonsils", "Fever", "Pain swallowing"],
    medicine: ["Pain relievers", "Antibiotics if bacterial"],
    nonMedicine: ["Warm salt water gargle", "Soft foods", "Stay hydrated"],
  },
};

// Improved matcher for dynamic AI text
const getMedicalDetails = (diagnosis) => {
  const normalized = diagnosis.toLowerCase().replace(/[^\w\s]/gi, ""); // Remove punctuation

  for (const [illness, data] of Object.entries(medicalDB)) {
    if (data.keywords.some((keyword) => normalized.includes(keyword))) {
      return data;
    }
  }

  return {
    dangerLevel: "Unknown",
    recoveryDays: "Varies",
    doctorRequired: "Consult if symptoms worsen",
    symptoms: [],
    medicine: [],
    nonMedicine: [],
  };
};
