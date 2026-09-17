import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      system: "FloodSense Real-Time Hydrological Monitoring & Early Warning System",
      version: "1.0.0-SIH26071",
      team: "Aqua Sentinel",
      satelliteSource: "Sentinel-5P CLOUD + GPM IMERG",
      model: "Gated Delta Neural Architecture"
    });
  });

  // AI Hydrological Advisory & SIH Judge Assistant
  app.post("/api/ai-advisory", async (req, res) => {
    try {
      const { prompt, context } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      const systemPrompt = `You are the Lead Hydro-Informatics & AI Research Scientist for FloodSense (SIH Problem Statement SIH26071, Team Aqua Sentinel).
FloodSense is an AI-based heavy rainfall early warning and inundation prediction system specifically focused on Assam, India.

System Specifications & Facts:
- Satellite Observation: Sentinel-5P OFFL L2 CLOUD NetCDF files (e.g. S5P_OFFL_L2__CLOUD__20260718T...nc). 1,877,850 raw pixels extracted. Handled ~270,264 missing values in cloud fraction and optical properties using quality flags (qa_value > 0.5) and spatial-temporal interpolation.
- Precipitation Observation: GPM IMERG 2024 precipitation product. 366 daily NetCDF/NetCDF4 files processed via Python xarray, converted to CSV, and filtered via Assam state boundary GeoJSON into 'assam_2024_rainfall.csv'.
- Master Rainfall Dataset Statistics: 262,788 rainfall records across 718 unique spatial grid cells and 366 days (Jan 1 - Dec 31, 2024). Mean rainfall: 6.44 mm/day, Std: 14.48 mm/day, Maximum: 241.63 mm/day.
- Machine Learning Dataset: 5,646 samples × 11 features (temporal cloud fraction, cloud top height, optical depth, delta time, coordinates, moisture proxies, antecedent rainfall).
- AI Model: Gated Delta Model (PyTorch). Captures sequential atmospheric accretion where state delta updates Δh_t are gated by atmospheric candidate vectors, avoiding gradient saturation and tracking sequential build-up of cloud moisture.
- Current Implemented Prototype: Satellite-based rainfall prediction from Sentinel-5P + IMERG -> Gated Delta -> Dashboard & Early Warning.
- Future Work / Extensions (NOT YET COMPLETED): Multi-source fusion (Radar, AWS rain gauges, NWP forecasts), 2D hydraulic flood inundation modeling (HEC-RAS / LISFLOOD-FP to output flood extent, depth, arrival onset time), and validation using Sentinel-1 SAR flood imagery.

Always be technically precise, academically grounded, concise, professional, and transparent about current implementations vs future roadmap.`;

      if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${systemPrompt}\n\nContext:\n${JSON.stringify(context || {})}\n\nUser Question:\n${prompt || "Provide an overview of the FloodSense early warning system."}`
                }
              ]
            }
          ]
        });

        return res.json({
          response: response.text,
          source: "gemini-ai"
        });
      }

      // Offline scientific fallback if GEMINI_API_KEY is not configured
      const fallbackReplies: Record<string, string> = {
        "model": "The Gated Delta Model was selected over standard LSTMs or feedforward networks because heavy rainfall in Assam is a time-dependent, sequential atmospheric process. By updating internal hidden representations via delta changes (Δh_t = Γ_u ⊙ Δ~_t), the network selectively accumulates multi-day moisture convergence while dampening transient sensor noise.",
        "data": "The preprocessing pipeline processed 366 daily GPM IMERG NetCDF files and over 1.87M Sentinel-5P CLOUD pixels. The 270,264 missing values in Sentinel-5P cloud fraction were screened using the qa_value flag (>0.5) and nearest-neighbor spatio-temporal imputation before clipping to the 718 Assam spatial grid cells.",
        "future": "Our current prototype delivers satellite-based rainfall prediction. The future roadmap couples these predictions with 2D hydrodynamic solvers (HEC-RAS and LISFLOOD-FP) for flood depth and inundation mapping, validated against Sentinel-1 C-band Synthetic Aperture Radar (SAR) flood masks.",
        "mitigation": "For districts exceeding the 115.5 mm/day threshold (Red Alert), ASDMA and district emergency operation centers (DEOCs) receive automated telemetry alerts to initiate pre-emptive evacuation in low-lying riverine chars along the Brahmaputra corridor."
      };

      const lowerPrompt = (prompt || "").toLowerCase();
      let matched = fallbackReplies["model"];
      if (lowerPrompt.includes("data") || lowerPrompt.includes("sentinel") || lowerPrompt.includes("imerg") || lowerPrompt.includes("netcdf")) {
        matched = fallbackReplies["data"];
      } else if (lowerPrompt.includes("future") || lowerPrompt.includes("hec-ras") || lowerPrompt.includes("radar") || lowerPrompt.includes("sar")) {
        matched = fallbackReplies["future"];
      } else if (lowerPrompt.includes("mitigation") || lowerPrompt.includes("evacuat") || lowerPrompt.includes("alert") || lowerPrompt.includes("disaster")) {
        matched = fallbackReplies["mitigation"];
      }

      res.json({
        response: matched,
        source: "domain-scientific-engine"
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to process query" });
    }
  });

  // Vite integration
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
    console.log(`FloodSense server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
