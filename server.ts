import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side Gemini API client initialization
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } catch (err) {
      console.warn("Failed to initialize Gemini AI client:", err);
    }
  }
  return aiClient;
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "RouteLink Smart Mobility Platform",
    timestamp: new Date().toISOString(),
    aiEnabled: !!process.env.GEMINI_API_KEY,
  });
});

// Calculate smart freight match score between a lorry route and a farmer cargo request
app.post("/api/cargo/match", (req, res) => {
  const { lorryRoute, availableCapacityTons, farmerPickup, cargoTons } = req.body;
  
  if (availableCapacityTons < cargoTons) {
    return res.json({
      matched: false,
      reason: "Available capacity is insufficient.",
    });
  }

  // Simulated highway detour distance calculation
  const detourKm = 8.5; // Avg 8-15km detour for rural collection
  const standardCostPerTonKm = 4.2; // ₹4.2 per ton-km standard rate
  const distanceKm = 185;
  const estimatedFreight = Math.round(cargoTons * distanceKm * standardCostPerTonKm * 0.72); // 28% discount vs solo hire
  const soloTruckEstimate = Math.round(estimatedFreight * 1.4);

  res.json({
    matched: true,
    compatibilityScore: 94,
    detourKm,
    estimatedFreightRs: estimatedFreight,
    soloTruckCostRs: soloTruckEstimate,
    farmerSavingsPercent: 28,
    extraDriverRevenueRs: estimatedFreight,
    recommendedPickupWindow: "14:30 - 15:30 PM",
  });
});

// SOS Emergency Broadcast Handler
app.post("/api/sos/broadcast", (req, res) => {
  const { driverId, vehicleNumber, location, emergencyType, description } = req.body;

  const respondersNotified = 14;
  const towingPartnersAlerted = 3;
  const fleetOwnerNotified = true;

  res.json({
    success: true,
    sosId: `sos-${Date.now()}`,
    status: "notified",
    timestamp: new Date().toISOString(),
    broadcastSummary: {
      nearbyDriversAlerted: respondersNotified,
      towingServicesAlerted: towingPartnersAlerted,
      fleetAlertSent: fleetOwnerNotified,
      assignedTowingUnit: {
        providerName: "Kaveri Heavy Highway Recovery & Towing",
        phone: "+91 98422 11990",
        vehicleType: "Tata 2518 Heavy Crane Unit",
        distanceKm: 4.2,
        etaMinutes: 11,
      }
    }
  });
});

// Keypad Phone IVR / SMS Automated Telecom Dispatcher
app.post("/api/ivr/dispatch", (req, res) => {
  const { phone, driverName, eventType, language = 'ta' } = req.body;

  let scriptText = "";
  if (eventType === 'traffic_alert') {
    scriptText = language === 'ta' 
      ? "ரூட்லிங்க் தானியங்கி எச்சரிக்கை: விக்ரவாண்டி NH45ல் 5 கி.மீ தூரத்தில் கடும் போக்குவரத்து நெரிசல். மாற்று வழியை தேர்ந்தெடுக்க 1 ஐ அழுத்தவும்."
      : "RouteLink Automated Alert: Heavy traffic 5km ahead on NH45. Press 1 to take Gingee bypass.";
  } else if (eventType === 'sos_alert') {
    scriptText = language === 'ta'
      ? "அவசர உதவி தகவல்: டோவிங் வாகனம் 4 கி.மீ தூரத்தில் புறப்பட்டுவிட்டது. வருகை நேரம் 11 நிமிடங்கள்."
      : "Emergency Dispatch: Towing vehicle en route, 4km away. ETA 11 minutes.";
  } else {
    scriptText = language === 'ta'
      ? "புதிய விவசாய விளைபொருள் சரக்கு கிடைத்துள்ளது. 1.5 டன் தக்காளி திருச்சி மார்க்கெட்டிற்கு. ஏற்க 1 ஐ அழுத்தவும்."
      : "New Agricultural Load Alert: 1.5 Tons Tomatoes to Trichy. Press 1 to accept.";
  }

  res.json({
    success: true,
    dispatchId: `ivr-${Date.now()}`,
    recipientPhone: phone,
    callStatus: "delivered",
    script: scriptText,
    dtmfChannels: ["1: Accept / Reroute", "2: Decline / Continue", "9: Replay Audio"],
    timestamp: new Date().toISOString(),
  });
});

// Gemini AI Route & Highway Assistant (Multilingual & voice-friendly)
app.post("/api/assistant/chat", async (req, res) => {
  const { message, language = 'en', role = 'driver', context } = req.body;

  const ai = getAiClient();
  if (ai) {
    try {
      const systemInstruction = `You are "RouteLink Sahay", a dedicated AI mobility and logistics co-pilot for commercial truck/bus drivers, fleet operators, and farmers in India.
Context:
- User Role: ${role}
- Preferred Language: ${language}
- Highway Context: South Indian Freight Corridors (NH45 Chennai-Trichy-Madurai, NH44 Bengaluru-Salem-Madurai, etc.)
Rules:
1. Provide ultra-clear, concise, actionable advice (2-4 sentences max) suitable for reading quickly or text-to-speech voice playback.
2. If asked about routes, rest stops, diesel bunks, AdBlue, tolls, or mechanical safety, give realistic, highway-accurate guidance.
3. If requested in Tamil, Hindi, Malayalam, Kannada, or Telugu, respond naturally in that language or transliteration.
4. Keep the tone respectful, supportive, and practical for lorry captains and farmers.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: message,
        config: {
          systemInstruction,
        }
      });

      const reply = response.text || "Safe travels on the highway. Drive with caution.";
      return res.json({ reply, aiGenerated: true });
    } catch (err: any) {
      console.warn("Gemini chat fallback:", err?.message);
    }
  }

  // Graceful rule-based smart fallback
  let fallbackReply = "Stay alert on NH45. Nearby Vikravandi HPCL fuel bunk has fresh AdBlue stock, safe lorry parking, and clean restrooms.";
  if (message.toLowerCase().includes("traffic") || message.toLowerCase().includes("jam")) {
    fallbackReply = "Heavy traffic detected at Vikravandi Toll Plaza (approx 45 min delay). Take the Villupuram Rural Bypass via Gingee SH-09 to save 38 minutes.";
  } else if (message.toLowerCase().includes("breakdown") || message.toLowerCase().includes("sos") || message.toLowerCase().includes("puncture")) {
    fallbackReply = "Emergency assistance active. Kaveri Heavy Recovery & Mobile Garage is 4.2 km away on NH45 KM 167 (ETA: 11 mins). Stay safely parked on the highway shoulder.";
  } else if (message.toLowerCase().includes("cargo") || message.toLowerCase().includes("farmer") || message.toLowerCase().includes("load")) {
    fallbackReply = "Farmer Arumugam at Ulundurpet has 1.5 Tons of fresh tomatoes for Trichy Gandhi Market. Your truck has 2.5 Tons spare capacity. Accepting this earns ₹2,400 extra revenue.";
  }

  return res.json({ reply: fallbackReply, aiGenerated: false });
});

// -------------------------------------------------------------
// Vite Middleware / Static Serve
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RouteLink Platform Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
